import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConfigured, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface AuditDetails {
  managingDirectors: string[];
  shareCapital: string | null;
  registerCourt: string | null;
  registerNumber: string | null;
  insolvencyNotices: Array<{ date?: string; court?: string; type?: string; caseNumber?: string }>;
  publicationsCount: number;
  lastSyncedAt: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.trim() || '';
  const reg = searchParams.get('reg')?.trim() || '';
  const court = searchParams.get('court')?.trim() || 'Handelsregister (Amtsgericht)';
  const country = (searchParams.get('country') || 'DE').toUpperCase();

  if (!name && !reg) {
    return NextResponse.json({ error: 'Company name or register number is required' }, { status: 400 });
  }

  // 1. Check Cloud SQL court_cache first (24h TTL) to avoid duplicate API calls
  if (isDatabaseConfigured() && reg) {
    try {
      const cached = await query<{
        status: string;
        register_court: string;
        register_number: string;
        case_number: string | null;
        details: AuditDetails | null;
        last_synced_at: string;
      }>(
        `SELECT status, register_court, register_number, case_number, details, last_synced_at
         FROM public.court_cache
         WHERE register_number = $1 AND country_code = $2
           AND last_synced_at > NOW() - INTERVAL '24 hours'
         LIMIT 1`,
        [reg, country]
      );

      if (cached.rows.length > 0) {
        const row = cached.rows[0];
        const isClear = row.status === 'clear';
        return NextResponse.json({
          verified: true,
          apiStatus: 'cached',
          source: 'Cloud SQL Cache (Frankfurt)',
          status: row.status,
          score: isClear ? 96 : row.status === 'preliminary_proceeding' ? 35 : 15,
          details: row.details || {
            managingDirectors: [],
            shareCapital: null,
            registerCourt: row.register_court,
            registerNumber: row.register_number,
            insolvencyNotices: [],
            publicationsCount: 0,
            lastSyncedAt: row.last_synced_at,
          },
        });
      }
    } catch (err) {
      console.error('[Audit API] Cache lookup failed:', err);
    }
  }

  // 2. Query handelsregister.ai for German companies if API key is present
  const apiKey = process.env.HANDELSREGISTER_API_KEY;
  if (country === 'DE' && apiKey && !apiKey.startsWith('demo_')) {
    try {
      const lookupQuery = reg && /^HR[AB]\s*\d+/i.test(reg) ? `${name} ${reg}`.trim() : name;
      const url = `https://handelsregister.ai/api/v1/fetch-organization?api_key=${apiKey}&q=${encodeURIComponent(lookupQuery)}&feature=insolvency_publications&feature=publications`;

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (res.status === 402) {
        return NextResponse.json({
          verified: false,
          apiStatus: 'credits_exhausted',
          message: 'Handelsregister API credits exhausted (0 remaining). Live verification unavailable.',
        });
      }

      if (!res.ok) {
        return NextResponse.json({
          verified: false,
          apiStatus: 'error',
          message: `Handelsregister API returned HTTP ${res.status}.`,
        });
      }

      const raw = await res.json();
      const org = raw?.data || raw?.organization || raw;

      const directorsRaw =
        org?.related_persons?.current ||
        org?.management ||
        org?.officers ||
        [];
      const managingDirectors: string[] = Array.isArray(directorsRaw)
        ? directorsRaw
            .map((p: { name?: string; full_name?: string; role?: string }) =>
              p.name || p.full_name ? `${p.name || p.full_name}${p.role ? ` (${p.role})` : ''}` : null
            )
            .filter((v: string | null): v is string => Boolean(v))
        : [];

      const insolvencyRaw = Array.isArray(org?.insolvency_publications) ? org.insolvency_publications : [];
      const status = insolvencyRaw.length > 0 ? 'preliminary_proceeding' : 'clear';
      const score = insolvencyRaw.length > 0 ? 25 : 96;

      const details: AuditDetails = {
        managingDirectors,
        shareCapital: org?.capital?.amount
          ? `${org.capital.amount} ${org.capital.currency || 'EUR'}`
          : org?.share_capital || null,
        registerCourt: org?.registration?.court || court,
        registerNumber: org?.registration?.register_number || reg || null,
        insolvencyNotices: insolvencyRaw,
        publicationsCount: Array.isArray(org?.publications) ? org.publications.length : 0,
        lastSyncedAt: new Date().toISOString(),
      };

      // Cache verified result in Cloud SQL court_cache
      if (isDatabaseConfigured() && details.registerNumber && details.registerCourt) {
        try {
          await query(
            `INSERT INTO public.court_cache (
              register_court, register_number, company_name, status, country_code, details, last_synced_at
            ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW())
            ON CONFLICT (register_court, register_number)
            DO UPDATE SET
              status = EXCLUDED.status,
              details = EXCLUDED.details,
              last_synced_at = NOW()`,
            [
              details.registerCourt,
              details.registerNumber,
              org?.name || name,
              status,
              country,
              JSON.stringify(details),
            ]
          );
        } catch (cacheErr) {
          console.error('[Audit API] Failed to cache in Cloud SQL:', cacheErr);
        }
      }

      return NextResponse.json({
        verified: true,
        apiStatus: 'live',
        source: 'handelsregister.ai (Live)',
        status,
        score,
        details,
      });
    } catch (err) {
      console.error('[Audit API] Fetch failed:', err);
      return NextResponse.json({
        verified: false,
        apiStatus: 'error',
        message: 'Failed to reach Handelsregister API.',
      });
    }
  }

  return NextResponse.json({
    verified: false,
    apiStatus: 'unverified',
    message:
      country === 'DE'
        ? 'No live Handelsregister API key configured.'
        : `Live automated registry sync for ${country} is pending API integration.`,
  });
}
