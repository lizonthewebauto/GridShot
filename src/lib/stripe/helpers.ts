import { TIER_CONFIG, type SubscriptionTier } from './config';

export function canCreateBrand(tier: SubscriptionTier, currentCount: number): boolean {
  return currentCount < TIER_CONFIG[tier].limits.brands;
}

export function canCreateSlide(tier: SubscriptionTier, currentMonthCount: number): boolean {
  return currentMonthCount < TIER_CONFIG[tier].limits.slidesPerMonth;
}

export function canExport(tier: SubscriptionTier, currentMonthCount: number): boolean {
  return currentMonthCount < TIER_CONFIG[tier].limits.exportsPerMonth;
}

export function canSchedule(tier: SubscriptionTier): boolean {
  return TIER_CONFIG[tier].limits.scheduling;
}

export function hasAllTemplates(tier: SubscriptionTier): boolean {
  return TIER_CONFIG[tier].limits.templates === 'all';
}
