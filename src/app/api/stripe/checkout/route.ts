import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, PRICE_IDS, TRIAL_DAYS } from '@/lib/stripe/server';
import { isAdmin } from '@/lib/admin';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admins skip the Stripe checkout entirely — mark them as pro directly.
  if (isAdmin(user.email)) {
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        subscription_status: 'admin',
        onboarding_step: 3,
      })
      .eq('id', user.id);
    const origin = request.headers.get('origin');
    return NextResponse.json({ url: `${origin}/onboarding?step=3` });
  }

  const { interval = 'year' } = await request.json() as { interval?: 'month' | 'year' };
  const priceId = interval === 'year' ? PRICE_IDS.pro_annual : PRICE_IDS.pro_monthly;

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: { supabase_user_id: user.id },
    },
    success_url: `${request.headers.get('origin')}/onboarding?step=3&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.get('origin')}/onboarding?step=2`,
  });

  return NextResponse.json({ url: session.url });
}
