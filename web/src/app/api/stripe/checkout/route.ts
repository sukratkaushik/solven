import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/lib/subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planId = (body.plan || 'pro') as SubscriptionTier;
    const plan = SUBSCRIPTION_PLANS[planId];

    if (!plan || planId === 'free') {
      return NextResponse.json({ error: 'Ungültiger Tarif gewählt' }, { status: 400 });
    }

    const userId = body.userId || 'demo_user_id';
    const userEmail = body.userEmail || 'demo@insolvenz-waechter.de';

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002';
    const successUrl = `${origin}/dashboard?checkout_success=true&plan=${planId}`;
    const cancelUrl = `${origin}/dashboard?checkout_canceled=true`;

    const session = await createStripeCheckoutSession({
      priceId: plan.stripePriceId || 'price_pro_monthly',
      userId,
      userEmail,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout Fehler';
    console.error('Checkout error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
