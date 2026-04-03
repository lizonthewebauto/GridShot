export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_tier: 'free' | 'pro' | 'business';
  subscription_status: string;
  billing_interval: 'month' | 'year' | null;
  onboarding_step: number;
  onboarding_completed: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  website_url: string | null;
  logo_url: string | null;
  tagline: string | null;
  voice_description: string | null;
  tone_presets: string[];
  style_keywords: string[];
  brand_personality: string | null;
  // ICP & Audience
  icp_description: string | null;
  target_audience: string | null;
  audience_pain_points: string[];
  audience_desires: string[];
  niche: string | null;
  service_area: string | null;
  price_positioning: string | null;
  differentiator: string | null;
  // Colors
  color_primary: string;
  color_secondary: string;
  color_accent: string | null;
  color_background: string | null;
  color_text: string | null;
  // Typography
  font_heading: string;
  font_body: string;
  font_accent: string | null;
  // Social proof
  review_count: string | null;
  review_tagline: string | null;
  // Social & web
  instagram_handle: string | null;
  website_tagline: string | null;
  social_links: Record<string, string>;
  // Integration
  bundle_social_team_id: string | null;
  is_default: boolean;
  extracted_from_url: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandExtraction {
  name: string | null;
  tagline: string | null;
  voice_description: string;
  brand_personality: string;
  style_keywords: string[];
  tone_presets: string[];
  icp_description: string;
  target_audience: string;
  audience_pain_points: string[];
  audience_desires: string[];
  niche: string;
  service_area: string | null;
  price_positioning: string;
  differentiator: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string | null;
  color_background: string | null;
  color_text: string | null;
  font_heading: string;
  font_body: string;
  font_accent: string | null;
  review_count: string | null;
  review_tagline: string | null;
  instagram_handle: string | null;
  website_tagline: string | null;
  social_links: Record<string, string>;
  logo_url: string | null;
}

export interface Slide {
  id: string;
  user_id: string;
  brand_id: string;
  template_id: string;
  photo_storage_path: string | null;
  photo_url: string | null;
  vibe: string;
  headline: string | null;
  body_text: string | null;
  slide_order: number;
  carousel_group_id: string | null;
  exported_image_path: string | null;
  exported_image_url: string | null;
  metadata: Record<string, unknown>;
  status: 'draft' | 'generating' | 'ready' | 'exporting' | 'exported' | 'posted';
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  slide_count_default: number;
  created_at: string;
}

export interface ConnectedAccount {
  id: string;
  user_id: string;
  brand_id: string;
  platform: string;
  platform_username: string | null;
  bundle_social_account_id: string;
  status: string;
  connected_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  brand_id: string;
  slide_ids: string[];
  caption: string | null;
  platforms: string[];
  bundle_social_post_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  error_message: string | null;
  created_at: string;
}

export const SLIDE_SIZES = {
  '1440x1080': { width: 1440, height: 1080, label: '4:3 Landscape' },
  '1080x1080': { width: 1080, height: 1080, label: '1:1 Square' },
  '1920x1080': { width: 1920, height: 1080, label: '16:9 Widescreen' },
  '1350x1080': { width: 1350, height: 1080, label: '5:4 Portrait' },
} as const;

export const DEFAULT_SLIDE_SIZE = '1440x1080' as const;

export type SlideSize = keyof typeof SLIDE_SIZES;

export interface TemplateData {
  brandName: string;
  photoUrl: string | null;
  headline: string;
  bodyText: string;
  reviewCount: string | null;
  reviewTagline: string | null;
  colorPrimary: string;
  colorSecondary: string;
  fontHeading: string;
  fontBody: string;
  width: number;
  height: number;
}

export interface Preset {
  id: string;
  user_id: string;
  brand_id: string;
  name: string;
  template_slug: string;
  vibe: string;
  headline: string | null;
  body_text: string | null;
  created_at: string;
  updated_at: string;
}

export const VIBE_OPTIONS = [
  'Authentic', 'Cinematic', 'Emotional', 'Bold',
  'Minimal', 'Romantic', 'Documentary', 'Editorial',
] as const;

export type Vibe = typeof VIBE_OPTIONS[number];

export const PLATFORM_OPTIONS = [
  'INSTAGRAM', 'THREADS', 'FACEBOOK', 'TWITTER',
  'TIKTOK', 'BLUESKY', 'LINKEDIN', 'PINTEREST',
] as const;

export type Platform = typeof PLATFORM_OPTIONS[number];
