// =========================================================================
// Stripe Native REST Client (No external npm package required)
// =========================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

interface CreateCheckoutParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: CreateCheckoutParams) {
  if (!STRIPE_SECRET_KEY) {
    // Simulated Checkout Session for testing without live credentials
    return {
      id: `cs_simulated_${Date.now()}`,
      url: `${successUrl}?session_id=simulated_${Date.now()}`,
      simulated: true,
    };
  }

  const body = new URLSearchParams();
  body.append('mode', 'subscription');
  body.append('payment_method_types[0]', 'card');
  body.append('payment_method_types[1]', 'sepa_debit'); // Critical for German B2B!
  body.append('line_items[0][price]', priceId);
  body.append('line_items[0][quantity]', '1');
  body.append('customer_email', userEmail);
  body.append('client_reference_id', userId);
  body.append('metadata[userId]', userId);
  body.append('success_url', successUrl);
  body.append('cancel_url', cancelUrl);
  body.append('allow_promotion_codes', 'true');
  body.append('tax_id_collection[enabled]', 'true'); // Automatically collects German USt-IdNr. for VAT!

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Stripe API error: ${errorText}`);
  }

  return res.json();
}

export async function createStripePortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!STRIPE_SECRET_KEY) {
    return { url: returnUrl, simulated: true };
  }

  const body = new URLSearchParams();
  body.append('customer', customerId);
  body.append('return_url', returnUrl);

  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Stripe Portal error: ${errorText}`);
  }

  return res.json();
}
