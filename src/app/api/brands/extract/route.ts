import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';

function isValidPublicUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const hostname = parsed.hostname.toLowerCase();
    // Block private/internal networks
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('172.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  if (!isValidPublicUrl(url)) {
    return NextResponse.json({ error: 'Please provide a valid public website URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Gridshot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Could not fetch website' }, { status: 400 });
    }

    const html = await res.text();
    const truncatedHtml = html.slice(0, 30000);

    const systemPrompt = `You are a brand strategist and web analyst. Analyze the provided website HTML and extract a comprehensive brand profile. Return ONLY valid JSON with this exact structure:

{
  "name": "brand name or null",
  "tagline": "main tagline or null",
  "voice_description": "detailed description of brand voice and writing style based on the page copy",
  "brand_personality": "if the brand were a person, describe their personality",
  "style_keywords": ["keyword1", "keyword2", "keyword3"],
  "tone_presets": ["tone1", "tone2", "tone3"],
  "icp_description": "detailed ideal customer profile based on the services and messaging",
  "target_audience": "who the brand is targeting",
  "audience_pain_points": ["pain point 1", "pain point 2", "pain point 3"],
  "audience_desires": ["desire 1", "desire 2", "desire 3"],
  "niche": "the specific niche or industry",
  "service_area": "geographic service area if mentioned, or null",
  "price_positioning": "premium/luxury/mid-range/accessible based on design and language",
  "differentiator": "what makes this brand unique based on messaging",
  "color_primary": "#hex of primary/dark color from CSS or inline styles",
  "color_secondary": "#hex of secondary/light color",
  "color_accent": "#hex of accent color or null",
  "color_background": "#hex of background color or null",
  "color_text": "#hex of main text color or null",
  "font_heading": "heading font name from Google Fonts or font-family declarations",
  "font_body": "body font name",
  "font_accent": "accent font or null",
  "review_count": "review/testimonial count if found, or null",
  "review_tagline": "a standout testimonial quote if found, or null",
  "instagram_handle": "instagram handle if found in links, or null",
  "website_tagline": "the main hero text or headline from the website",
  "social_links": {"platform": "url"},
  "logo_url": "logo image URL if found, or null"
}

Analyze the following:
- Writing style and tone from all visible text
- Color scheme from CSS variables, inline styles, class names, and style blocks
- Fonts from Google Fonts links, @font-face rules, and font-family declarations
- Target audience from service descriptions, pricing language, and positioning
- Social media links from href attributes containing instagram, facebook, twitter, tiktok, etc.
- Logo from img tags in header/nav areas
- Testimonials and reviews from quote/review sections

Use common font names if you can identify them. For colors, extract actual hex values from the HTML/CSS. If you can't find a specific value, use reasonable defaults based on the overall aesthetic.`;

    const result = await chatCompletion(systemPrompt, truncatedHtml);

    let cleaned = result.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    const extraction = JSON.parse(cleaned);
    return NextResponse.json(extraction);
  } catch (err) {
    console.error('Brand extraction error:', err);
    return NextResponse.json({ error: 'Brand extraction failed. Please try again.' }, { status: 500 });
  }
}
