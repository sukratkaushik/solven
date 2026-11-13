import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConfigured, query } from '@/lib/db';
import { verifyPassword, SESSION_COOKIE_NAME, getSessionCookieOptions, signSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: 'Datenbank nicht verbunden. Bitte nutzen Sie den Demo-Zugang.' },
        { status: 503 }
      );
    }

    const { email, password } = await request.json();
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await query<{
      id: string;
      email: string;
      password_hash: string | null;
      full_name: string | null;
    }>(
      'SELECT id, email, password_hash, full_name FROM public.users WHERE email = $1',
      [normalizedEmail]
    );

    const user = result.rows[0];
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse oder Passwort.' }, { status: 401 });
    }

    const token = signSessionToken({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch (error) {
    console.error('[Auth Login] Error:', error);
    return NextResponse.json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 500 });
  }
}
