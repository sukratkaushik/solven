import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer;

        if (userId) {
          console.log(`[Stripe Webhook] Upgrading user ${userId} to Pro plan...`);
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              subscription_status: 'active',
              subscription_tier: 'pro',
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log(`[Stripe Webhook] Subscription canceled for customer ${customerId}`);
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            subscription_tier: 'free',
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
