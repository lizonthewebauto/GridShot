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

export interface BrandColor {
  label: string;
  value: string;
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
  brand_colors: BrandColor[];
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
  // ICP & Audience
  icp_description: string;
  target_audience: string;
  audience_pain_points: string[];
  audience_desires: string[];
  niche: string;
  service_area: string | null;
  price_positioning: string;
  differentiator: string;
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

// Element alignment and position options
export type ElementAlignment = 'left' | 'center' | 'right';
export type ElementPosition = 'top' | 'bottom';

// Swipe arrow style options
export const SWIPE_ARROW_STYLES = [
  'text',           // "Swipe →" text
  'arrow-right',    // Simple → arrow
  'chevron',        // Single chevron >
  'double-chevron', // Double chevron >>
  'circle-arrow',   // Arrow in circle ⊕→
  'line-arrow',     // Long line with arrow ——→
  'dots',           // Three dots • • •
  'hand-swipe',     // Hand swipe icon 👆
  'arrow-minimal',  // Thin minimal arrow
  'none',           // No arrow, text only
] as const;
export type SwipeArrowStyle = typeof SWIPE_ARROW_STYLES[number];

// Footer text source options
export const FOOTER_TEXT_SOURCES = [
  'custom',         // User-entered custom text
  'brand-name',     // Brand name
  'website',        // Brand website URL
  'handle',         // Instagram handle / username
  'tagline',        // Brand tagline
  'ai-generated',   // AI-generated text
  'review',         // Review count + tagline (original default)
] as const;
export type FooterTextSource = typeof FOOTER_TEXT_SOURCES[number];

export const FOOTER_SOURCE_LABELS: Record<FooterTextSource, string> = {
  'custom': 'Custom Text',
  'brand-name': 'Brand Name',
  'website': 'Website URL',
  'handle': 'Handle / Username',
  'tagline': 'Brand Tagline',
  'ai-generated': 'AI Generated',
  'review': 'Review Info',
};

// Font weight options
export const FONT_WEIGHT_OPTIONS = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semibold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
] as const;

// All available fonts (heading + body combined, deduplicated)
export const ALL_FONTS = [
  'Playfair Display',
  'Cormorant Garamond',
  'Libre Baskerville',
  'DM Serif Display',
  'Merriweather',
  'Lora',
  'Source Serif Pro',
  'EB Garamond',
  'Crimson Text',
  'Bitter',
  'Josefin Sans',
  'Montserrat',
  'Source Sans Pro',
  'Open Sans',
  'Nunito',
  'Raleway',
  'Work Sans',
  'Inter',
  'DM Sans',
  'Karla',
  'Rubik',
] as const;

// Configuration for each editable element on a slide
export interface ElementConfig {
  visible: boolean;
  text?: string;
  fontSize?: number;
  alignment?: ElementAlignment;
  position?: ElementPosition;
  lineHeight?: number;       // e.g. 1.1, 1.4, 1.6
  fontFamily?: string;       // per-element font override
  fontWeight?: number;       // 300-900
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;    // in em units, e.g. 0.02, 0.15
  color?: string;            // per-element color override
}

// Extended config for swipe indicator
export interface SwipeIndicatorConfig extends ElementConfig {
  arrowStyle?: SwipeArrowStyle;
  color?: string;        // Custom color override (null = use primary)
  opacity?: number;      // 0-1, default 0.5
}

// Extended config for footer
export interface FooterConfig extends ElementConfig {
  textSource?: FooterTextSource;
}

// All configurable elements on a slide
export interface SlideElements {
  header: ElementConfig;              // Brand name at top
  headline: ElementConfig;            // Main headline text
  body: ElementConfig;                // Body/description text
  footer: FooterConfig;               // Review count / tagline area
  swipeIndicator: SwipeIndicatorConfig; // Swipe arrow indicator
}

// Default element configs
export const DEFAULT_ELEMENTS: SlideElements = {
  header: { visible: true, fontSize: 18, alignment: 'center', position: 'top', letterSpacing: 0.35, fontWeight: 400, fontStyle: 'normal' },
  headline: { visible: true, fontSize: 64, alignment: 'left', position: 'top', lineHeight: 1.1, fontWeight: 900, letterSpacing: 0.02, fontStyle: 'normal' },
  body: { visible: true, fontSize: 24, alignment: 'left', position: 'top', lineHeight: 1.6, fontWeight: 400, fontStyle: 'italic' },
  footer: { visible: true, fontSize: 18, alignment: 'left', position: 'bottom', fontStyle: 'italic', textSource: 'review' },
  swipeIndicator: { visible: true, text: 'Swipe →', fontSize: 16, alignment: 'right', position: 'bottom', arrowStyle: 'text', opacity: 0.5, letterSpacing: 0.15 },
};

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
  elements?: SlideElements;
  // Extra brand fields for footer text source resolution
  websiteUrl?: string | null;
  instagramHandle?: string | null;
  brandTagline?: string | null;
}

// Font options available in the app
export const HEADING_FONTS = [
  'Playfair Display',
  'Cormorant Garamond',
  'Libre Baskerville',
  'DM Serif Display',
  'Merriweather',
  'Lora',
  'Source Serif Pro',
  'EB Garamond',
  'Crimson Text',
  'Bitter',
  'Josefin Sans',
  'Montserrat',
] as const;

export const BODY_FONTS = [
  'Lora',
  'Source Sans Pro',
  'Open Sans',
  'Nunito',
  'Raleway',
  'Work Sans',
  'Inter',
  'DM Sans',
  'Karla',
  'Rubik',
] as const;

// Brand preset for saving reusable style configurations
export interface BrandPreset {
  id: string;
  user_id: string;
  brand_id: string;
  name: string;
  color_primary: string;
  color_secondary: string;
  font_heading: string;
  font_body: string;
  vibe: string;
  elements: SlideElements;
  created_at: string;
  updated_at: string;
}

// Create workflow configuration
export interface CreateConfig {
  brandId: string;
  idea: string;
  templateSlug: string;
  slideCount: number;
  fontHeading: string;
  fontBody: string;
  colorPrimary: string;
  colorSecondary: string;
  vibe: string;
}

// Per-slide state in the editor
export interface SlideState {
  id: string;
  order: number;
  photoUrl: string | null;
  headline: string;
  bodyText: string;
  vibe: string;
  elements: SlideElements;
}

// Upload record for the library
export interface UploadedFile {
  name: string;
  url: string;
  storagePath: string;
  createdAt: string;
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
