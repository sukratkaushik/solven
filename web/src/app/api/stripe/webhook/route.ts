import { NextRequest, NextResponse } from 'next/server';
import { isDatabaseConfigured, query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ received: true, note: 'Database not configured' });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer;

        if (userId) {
          console.log(`[Stripe Webhook] Upgrading user ${userId} to Pro plan...`);
          await query(
            `UPDATE public.users
             SET stripe_customer_id = $1,
                 subscription_status = 'active',
                 subscription_tier = 'pro',
                 max_companies = 25
             WHERE id = $2`,
            [customerId, userId]
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log(`[Stripe Webhook] Subscription canceled for customer ${customerId}`);
        await query(
          `UPDATE public.users
           SET subscription_status = 'canceled',
               subscription_tier = 'free',
               max_companies = 3
           WHERE stripe_customer_id = $1`,
          [customerId]
        );
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
