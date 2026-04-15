export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface TierConfig {
  name: string;
  description: string;
  price: number; // monthly price in dollars
  stripePriceId: string | null; // null for free tier
  limits: {
    brands: number;        // max brands
    slidesPerMonth: number; // max slides created per month
    exportsPerMonth: number; // max exports per month
    templates: 'basic' | 'all';
    scheduling: boolean;
    prioritySupport: boolean;
  };
  features: string[];
}

// After creating products/prices in Stripe Dashboard, set these env vars:
// NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
// NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=price_xxx
export const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: 'Free',
    description: 'Get started with branded slides',
    price: 0,
    stripePriceId: null,
    limits: {
      brands: 1,
      slidesPerMonth: 10,
      exportsPerMonth: 5,
      templates: 'basic',
      scheduling: false,
      prioritySupport: false,
    },
    features: [
      '1 brand profile',
      '10 slides per month',
      '5 exports per month',
      'Basic templates',
      'AI copy generation',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For creators who post consistently',
    price: 29,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    limits: {
      brands: 5,
      slidesPerMonth: Infinity,
      exportsPerMonth: Infinity,
      templates: 'all',
      scheduling: true,
      prioritySupport: false,
    },
    features: [
      'Up to 5 brands',
      'Unlimited slides',
      'Unlimited exports',
      'All templates',
      'Post scheduling',
      'AI copy generation',
      'Multi-platform publishing',
    ],
  },
  business: {
    name: 'Business',
    description: 'For teams and agencies',
    price: 79,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || '',
    limits: {
      brands: Infinity,
      slidesPerMonth: Infinity,
      exportsPerMonth: Infinity,
      templates: 'all',
      scheduling: true,
      prioritySupport: true,
    },
    features: [
      'Unlimited brands',
      'Unlimited slides',
      'Unlimited exports',
      'All templates',
      'Post scheduling',
      'AI copy generation',
      'Multi-platform publishing',
      'Priority support',
    ],
  },
};
