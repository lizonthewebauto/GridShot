'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Zap, Crown, Loader2 } from 'lucide-react';
import { TIER_CONFIG, type SubscriptionTier } from '@/lib/stripe/config';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  async function handleCheckout(tier: SubscriptionTier) {
    setLoading(tier);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setPortalLoading(false);
    }
  }

  const tiers = Object.entries(TIER_CONFIG) as [SubscriptionTier, typeof TIER_CONFIG[SubscriptionTier]][];
  const tierIcons: Record<SubscriptionTier, typeof Zap> = {
    free: Check,
    pro: Zap,
    business: Crown,
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {success && (
        <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400 text-sm">
          Subscription activated! You now have access to all features.
        </div>
      )}
      {canceled && (
        <div className="mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-yellow-400 text-sm">
          Checkout canceled. No changes were made.
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Choose your plan
        </h1>
        <p className="text-muted mt-2 max-w-lg mx-auto">
          Start free, upgrade when you need more brands, slides, and publishing power.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(([key, config]) => {
          const Icon = tierIcons[key];
          const isPopular = key === 'pro';

          return (
            <div
              key={key}
              className={cn(
                'rounded-lg border p-6 flex flex-col relative',
                isPopular
                  ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                  : 'border-border bg-card'
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <Icon className={cn('w-8 h-8 mb-3', isPopular ? 'text-accent' : 'text-muted')} />
                <h2 className="font-heading text-xl font-bold text-foreground">{config.name}</h2>
                <p className="text-muted text-sm mt-1">{config.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">
                  {config.price === 0 ? 'Free' : `$${config.price}`}
                </span>
                {config.price > 0 && (
                  <span className="text-muted text-sm ml-1">/month</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {config.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {key === 'free' ? (
                <button
                  disabled
                  className="w-full rounded-md bg-card border border-border px-4 py-2.5 text-sm font-medium text-muted cursor-default"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(key)}
                  disabled={loading !== null}
                  className={cn(
                    'w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                    isPopular
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'bg-card border border-border text-foreground hover:bg-card-hover'
                  )}
                >
                  {loading === key ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Start 7-day free trial`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          {portalLoading && <Loader2 className="w-3 h-3 animate-spin" />}
          Manage existing subscription
        </button>
      </div>
    </div>
  );
}
