import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConfigured, query } from '@/lib/db';
import { hashPassword, SESSION_COOKIE_NAME, getSessionCookieOptions, signSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: 'Datenbank nicht verbunden. Bitte nutzen Sie den Demo-Zugang.' },
        { status: 503 }
      );
    }

    const { email, password, fullName } = await request.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Das Passwort muss mindestens 6 Zeichen lang sein.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await query('SELECT id FROM public.users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const result = await query<{ id: string; email: string; full_name: string | null }>(
      `INSERT INTO public.users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name`,
      [normalizedEmail, passwordHash, fullName ? String(fullName).trim() : null]
    );

    const user = result.rows[0];
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
    console.error('[Auth Signup] Error:', error);
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 });
  }
}
