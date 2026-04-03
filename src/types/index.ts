export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  subscription_tier: 'free' | 'pro' | 'business';
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  voice_description: string | null;
  tone_presets: string[];
  color_primary: string;
  color_secondary: string;
  color_accent: string | null;
  font_heading: string;
  font_body: string;
  review_count: string | null;
  review_tagline: string | null;
  bundle_social_team_id: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
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
}

export const VIBE_OPTIONS = [
  'Authentic',
  'Cinematic',
  'Emotional',
  'Bold',
  'Minimal',
  'Romantic',
  'Documentary',
  'Editorial',
] as const;

export type Vibe = typeof VIBE_OPTIONS[number];

export const PLATFORM_OPTIONS = [
  'INSTAGRAM',
  'THREADS',
  'FACEBOOK',
  'TWITTER',
  'TIKTOK',
  'BLUESKY',
  'LINKEDIN',
  'PINTEREST',
] as const;

export type Platform = typeof PLATFORM_OPTIONS[number];
