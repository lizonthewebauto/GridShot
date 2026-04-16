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

export type ImageAspect = '1/1' | '4/5' | '3/4' | '16/9' | '2/3' | '3/2' | '9/16';
export type ImageShape = 'square' | 'circle' | 'arch' | 'hexagon' | 'rounded' | 'polaroid' | 'oval';
export type BrandPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'none';

// ===== Configurable elements (used by Editorial Pro and similar templates) =====

export type ElementAlignment = 'left' | 'center' | 'right';
export type ElementPosition = 'top' | 'bottom';

export const SWIPE_ARROW_STYLES = [
  'text',
  'arrow-right',
  'chevron',
  'double-chevron',
  'circle-arrow',
  'line-arrow',
  'dots',
  'hand-swipe',
  'arrow-minimal',
  'none',
] as const;
export type SwipeArrowStyle = typeof SWIPE_ARROW_STYLES[number];

export const FOOTER_TEXT_SOURCES = [
  'custom',
  'brand-name',
  'website',
  'handle',
  'tagline',
  'review',
] as const;
export type FooterTextSource = typeof FOOTER_TEXT_SOURCES[number];

export const FOOTER_SOURCE_LABELS: Record<FooterTextSource, string> = {
  'custom': 'Custom Text',
  'brand-name': 'Brand Name',
  'website': 'Website URL',
  'handle': 'Handle / Username',
  'tagline': 'Brand Tagline',
  'review': 'Review Info',
};

export const FONT_WEIGHT_OPTIONS = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semibold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
] as const;

export const ALL_FONTS = [
  'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'DM Serif Display',
  'Lora', 'Bitter', 'EB Garamond',
  'Montserrat', 'Inter', 'DM Sans', 'Work Sans', 'Karla', 'Rubik',
  'Oswald', 'Bebas Neue', 'Courier Prime',
  'Caveat', 'Dancing Script', 'Amatic SC', 'Permanent Marker',
] as const;

export interface ElementConfig {
  visible: boolean;
  text?: string;
  fontSize?: number;
  alignment?: ElementAlignment;
  position?: ElementPosition;
  lineHeight?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;
  color?: string;
}

export interface SwipeIndicatorConfig extends ElementConfig {
  arrowStyle?: SwipeArrowStyle;
  opacity?: number;
}

export interface FooterConfig extends ElementConfig {
  textSource?: FooterTextSource;
}

export interface SlideElements {
  header: ElementConfig;
  headline: ElementConfig;
  body: ElementConfig;
  footer: FooterConfig;
  swipeIndicator: SwipeIndicatorConfig;
}

export const DEFAULT_ELEMENTS: SlideElements = {
  header:    { visible: true, fontSize: 24, alignment: 'center', position: 'top', letterSpacing: 0.35, fontWeight: 400, fontStyle: 'normal' },
  headline:  { visible: true, fontSize: 88, alignment: 'left',   position: 'top', lineHeight: 1.1, fontWeight: 900, letterSpacing: 0.02, fontStyle: 'normal' },
  body:      { visible: true, fontSize: 32, alignment: 'left',   position: 'top', lineHeight: 1.5, fontWeight: 400, fontStyle: 'italic' },
  footer:    { visible: true, fontSize: 22, alignment: 'left',   position: 'bottom', fontStyle: 'italic', textSource: 'review' },
  swipeIndicator: { visible: true, text: 'Swipe →', fontSize: 22, alignment: 'right', position: 'bottom', arrowStyle: 'text', opacity: 0.5, letterSpacing: 0.15 },
};

export interface TemplateData {
  // Core
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

  // Flex fields — all optional, templates read what they need
  colorAccent?: string;
  colorGradientFrom?: string;
  colorGradientTo?: string;
  gradientAngle?: number;
  imageAspect?: ImageAspect;
  imageShape?: ImageShape;
  photos?: (string | null)[];
  tagline?: string | null;
  dateText?: string | null;
  locationText?: string | null;
  customText?: string | null;
  customText2?: string | null;
  customText3?: string | null;
  variant?: string;
  brandPosition?: BrandPosition;

  // Editorial Pro element overrides + extra brand fields for footer text source
  elements?: SlideElements;
  websiteUrl?: string | null;
  instagramHandle?: string | null;
  brandTagline?: string | null;
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

export interface UploadedFile {
  name: string;
  url: string;
  storagePath: string;
  createdAt?: string;
}

export const PLATFORM_OPTIONS = [
  'INSTAGRAM', 'THREADS', 'FACEBOOK', 'TWITTER',
  'TIKTOK', 'BLUESKY', 'LINKEDIN', 'PINTEREST',
] as const;

export type Platform = typeof PLATFORM_OPTIONS[number];
