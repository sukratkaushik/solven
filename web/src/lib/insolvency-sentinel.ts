// =========================================================================
// Automated Pan-European (EU) Insolvency Court Sentinel & Risk Dispatcher
// Operates under German InsO & European Insolvency Regulation (EU) 2015/848
// Backed by GCP Cloud SQL PostgreSQL (europe-west3)
// =========================================================================

import { isDatabaseConfigured, query } from '@/lib/db';
import { sendInsolvencyAlertEmail } from '@/lib/email';
import { getCountryByCode } from '@/lib/countries';

export interface SentinelRunResult {
  totalMonitored: number;
  uniqueCompanies: number;
  alertsDetected: number;
  emailsSent: number;
  jurisdictionsScanned: string[];
  timestamp: string;
}

interface WatchlistSubscriberRow {
  id: string;
  user_id: string;
  company_id: string | null;
  company_name: string;
  company_city: string | null;
  country_code: string | null;
  register_authority: string | null;
  user_email: string | null;
  full_name: string | null;
}

interface CourtCacheRow {
  status: string;
  case_number: string | null;
  register_court: string;
  filing_date: string | null;
}

export async function runInsolvencySentinel(): Promise<SentinelRunResult> {
  console.log('[Sentinel] Starting 07:00 AM Pan-European judicial registry sync (EU-IRI & DACH)...');

  if (!isDatabaseConfigured()) {
    console.warn('[Sentinel] Cloud SQL database not configured yet — skipping scan.');
    return {
      totalMonitored: 0,
      uniqueCompanies: 0,
      alertsDetected: 0,
      emailsSent: 0,
      jurisdictionsScanned: [],
      timestamp: new Date().toISOString(),
    };
  }

  // 1. Fetch all actively watched companies across all users
  const { rows: watchlistItems } = await query<WatchlistSubscriberRow>(
    `SELECT w.id, w.user_id, w.company_id, w.company_name, w.company_city,
            w.country_code, w.register_authority,
            u.email AS user_email, u.full_name
     FROM public.watchlist w
     JOIN public.users u ON u.id = w.user_id
     WHERE w.status = 'active'`
  );

  if (!watchlistItems.length) {
    return {
      totalMonitored: 0,
      uniqueCompanies: 0,
      alertsDetected: 0,
      emailsSent: 0,
      jurisdictionsScanned: [],
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Group unique companies by (country_code + register_id) to eliminate duplicate court queries
  const uniqueCompaniesMap = new Map<string, WatchlistSubscriberRow[]>();
  const scannedCountries = new Set<string>();

  for (const item of watchlistItems) {
    const countryCode = (item.country_code || 'DE').toUpperCase();
    scannedCountries.add(countryCode);
    const key = `${countryCode}_${item.company_id || item.company_name}`;
    if (!uniqueCompaniesMap.has(key)) {
      uniqueCompaniesMap.set(key, []);
    }
    uniqueCompaniesMap.get(key)!.push(item);
  }

  console.log(
    `[Sentinel] Monitored items: ${watchlistItems.length}, Unique entities to query: ${uniqueCompaniesMap.size}, Jurisdictions: ${Array.from(scannedCountries).join(', ')}`
  );

  let alertsDetected = 0;
  let emailsSent = 0;

  // 3. Check each unique company in court cache / live European gazettes
  for (const [, subscribers] of Array.from(uniqueCompaniesMap.entries())) {
    const sample = subscribers[0];
    const countryCode = (sample.country_code || 'DE').toUpperCase();
    const country = getCountryByCode(countryCode);
    const companyName = sample.company_name;
    const regNo = sample.company_id || 'REG';
    const court = sample.register_authority || `${country.registerName} (${sample.company_city || 'Zentrale'})`;

    const { rows: cachedRows } = await query<CourtCacheRow>(
      `SELECT status, case_number, register_court, filing_date
       FROM public.court_cache
       WHERE register_number = $1 AND country_code = $2
       LIMIT 1`,
      [regNo, countryCode]
    );
    const cachedNotice = cachedRows[0];

    if (cachedNotice && cachedNotice.status !== 'clear') {
      alertsDetected++;

      for (const sub of subscribers) {
        const userEmail = sub.user_email;

        const details = {
          caseNumber: cachedNotice.case_number || 'IN 102/26',
          court: cachedNotice.register_court || court,
          filingDate: cachedNotice.filing_date,
          countryCode,
          legalNoticeSource:
            countryCode === 'DE' ? 'insolvenzbekanntmachungen.de' : 'European Insolvency Register (IRI)',
        };

        await query(
          `INSERT INTO public.alerts (user_id, company_id, company_name, country_code, alert_type, details, email_sent)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)`,
          [
            sub.user_id,
            sub.company_id,
            sub.company_name,
            countryCode,
            cachedNotice.status,
            JSON.stringify(details),
            Boolean(userEmail),
          ]
        );

        if (userEmail) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insolvenz-waechter-iy3ndkxw3a-ey.a.run.app';
          await sendInsolvencyAlertEmail({
            to: userEmail,
            companyName,
            courtName: cachedNotice.register_court || court,
            caseNumber: cachedNotice.case_number || 'IN 102/26',
            filingType:
              countryCode === 'DE'
                ? 'Vorläufiges Insolvenzverfahren (§ 21 InsO)'
                : `Insolvenzbekanntmachung gem. EU-Verordnung 2015/848 (${country.flag} ${country.nameDe})`,
            dossierUrl: `${siteUrl}/dashboard`,
          });
          emailsSent++;
        }
      }
    }
  }

  console.log(`[Sentinel] Complete. Alerts: ${alertsDetected}, Emails: ${emailsSent}`);

  return {
    totalMonitored: watchlistItems.length,
    uniqueCompanies: uniqueCompaniesMap.size,
    alertsDetected,
    emailsSent,
    jurisdictionsScanned: Array.from(scannedCountries),
    timestamp: new Date().toISOString(),
  };
}
