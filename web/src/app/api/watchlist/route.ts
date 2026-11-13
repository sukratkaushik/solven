import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: 'Datenbank nicht verbunden' }, { status: 503 });
    }

    const result = await query(
      `SELECT id, company_name, company_id, company_city, legal_form, status,
              country_code, vat_number, register_authority, currency, last_checked_at, added_at
       FROM public.watchlist
       WHERE user_id = $1
       ORDER BY added_at DESC`,
      [user.id]
    );

    return NextResponse.json({ items: result.rows });
  } catch (error) {
    console.error('[Watchlist GET] Error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: 'Datenbank nicht verbunden' }, { status: 503 });
    }

    const body = await request.json();
    const {
      company_name,
      company_id,
      company_city,
      legal_form,
      country_code,
      register_authority,
      currency,
      vat_number,
    } = body;

    if (!company_name) {
      return NextResponse.json({ error: 'Firmenname erforderlich' }, { status: 400 });
    }

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM public.watchlist WHERE user_id = $1',
      [user.id]
    );
    const currentCount = parseInt(countResult.rows[0]?.count || '0', 10);

    const userResult = await query<{ subscription_tier: string; max_companies: number }>(
      'SELECT subscription_tier, max_companies FROM public.users WHERE id = $1',
      [user.id]
    );
    const profile = userResult.rows[0];
    const tier = (profile?.subscription_tier || 'free') as 'free' | 'pro' | 'business';
    const maxAllowed = profile?.max_companies || (tier === 'business' ? 100 : tier === 'pro' ? 25 : 3);

    if (currentCount >= maxAllowed) {
      return NextResponse.json(
        {
          error:
            tier === 'free'
              ? 'Gratis-Limit erreicht (3 Unternehmen). Upgraden Sie auf Pro, um bis zu 25 europäische Unternehmen zu überwachen.'
              : `Tarif-Limit von ${maxAllowed} Unternehmen erreicht. Kontaktieren Sie uns für ein Kanzlei-Upgrade.`,
        },
        { status: 403 }
      );
    }

    const inserted = await query(
      `INSERT INTO public.watchlist (
        user_id, company_name, company_id, company_city, legal_form,
        country_code, register_authority, currency, vat_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        user.id,
        company_name,
        company_id || null,
        company_city || null,
        legal_form || null,
        (country_code || 'DE').toUpperCase(),
        register_authority || null,
        currency || 'EUR',
        vat_number || null,
      ]
    );

    return NextResponse.json({ item: inserted.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('[Watchlist POST] Error:', error);
    return NextResponse.json({ error: 'Fehler beim Hinzufügen zur Watchlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: 'Datenbank nicht verbunden' }, { status: 503 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    await query('DELETE FROM public.watchlist WHERE id = $1 AND user_id = $2', [id, user.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Watchlist DELETE] Error:', error);
    return NextResponse.json({ error: 'Fehler beim Entfernen aus der Watchlist' }, { status: 500 });
  }
}
