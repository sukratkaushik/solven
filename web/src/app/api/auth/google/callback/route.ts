import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConfigured, query } from '@/lib/db';
import { getPublicOrigin, getSessionCookieOptions, SESSION_COOKIE_NAME, signSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

export async function GET(request: NextRequest) {
  const origin = getPublicOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const storedState = request.cookies.get('solven_oauth_state')?.value;

  const failRedirect = (reason: string) => {
    const res = NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason)}`);
    res.cookies.delete('solven_oauth_state');
    return res;
  };

  if (oauthError || !code || !state || !storedState || state !== storedState) {
    return failRedirect('oauth_state_invalid');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failRedirect('google_not_configured');
  }

  if (!isDatabaseConfigured()) {
    return failRedirect('db_not_configured');
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth] Token exchange failed:', tokenData);
      return failRedirect('oauth_token_failed');
    }

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = (await userInfoRes.json()) as GoogleUserInfo;
    if (!userInfoRes.ok || !profile.sub || !profile.email || profile.email_verified === false) {
      console.error('[Google OAuth] UserInfo failed:', profile);
      return failRedirect('oauth_profile_failed');
    }

    const normalizedEmail = profile.email.trim().toLowerCase();
    const fullName = profile.name ? profile.name.trim() : null;

    // Upsert user by google_sub or email
    const existing = await query<{ id: string; email: string; full_name: string | null }>(
      `SELECT id, email, full_name
       FROM public.users
       WHERE google_sub = $1 OR email = $2
       LIMIT 1`,
      [profile.sub, normalizedEmail]
    );

    let user: { id: string; email: string; full_name: string | null };

    if (existing.rows.length > 0) {
      const updated = await query<{ id: string; email: string; full_name: string | null }>(
        `UPDATE public.users
         SET google_sub = COALESCE(google_sub, $1),
             full_name = COALESCE(full_name, $2)
         WHERE id = $3
         RETURNING id, email, full_name`,
        [profile.sub, fullName, existing.rows[0].id]
      );
      user = updated.rows[0];
    } else {
      const inserted = await query<{ id: string; email: string; full_name: string | null }>(
        `INSERT INTO public.users (email, google_sub, full_name)
         VALUES ($1, $2, $3)
         RETURNING id, email, full_name`,
        [normalizedEmail, profile.sub, fullName]
      );
      user = inserted.rows[0];
    }

    const sessionToken = signSessionToken({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });

    const response = NextResponse.redirect(`${origin}/dashboard`);
    response.cookies.delete('solven_oauth_state');
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
    return response;
  } catch (error) {
    console.error('[Google OAuth] Unexpected error:', error);
    return failRedirect('oauth_failed');
  }
}
