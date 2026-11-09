import { NextRequest, NextResponse } from 'next/server';
import { createStripePortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customerId = body.customerId || 'cus_demo';
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';

    const portal = await createStripePortalSession({
      customerId,
      returnUrl: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Portal Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
