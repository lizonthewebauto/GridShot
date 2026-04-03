import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';
import type { BrandExtraction } from '@/types';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // Fetch the website HTML
  let html: string;
  try {
    const res = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    return NextResponse.json(
      { error: `Could not fetch website: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 422 }
    );
  }

  // Extract structured parts from HTML
  const styleBlocks = (html.match(/<style[\s\S]*?<\/style>/gi) || []).join('\n').slice(0, 10000);
  const metaTags = (html.match(/<meta[^>]*>/gi) || []).join('\n');
  const linkTags = (html.match(/<link[^>]*>/gi) || []).join('\n');
  const titleTag = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';

  // Extract inline styles and class-related color/font info
  const inlineStyles = (html.match(/style="[^"]*"/gi) || []).slice(0, 50).join('\n');
  const cssVars = (html.match(/--[\w-]+:\s*[^;]+;/g) || []).join('\n');

  // Strip to text content
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const pageText = stripped.slice(0, 8000);

  // Extract social links from HTML
  const socialLinksRaw = (html.match(/href="[^"]*(?:instagram|facebook|twitter|tiktok|youtube|pinterest|linkedin|threads)[^"]*"/gi) || [])
    .map(m => m.replace(/^href="/, '').replace(/"$/, ''));

  const systemPrompt = `You are an expert brand strategist and web analyst. Given a website's content, styles, and metadata, you will produce a comprehensive brand profile including visual identity, voice analysis, ideal customer profile (ICP), and target audience.

You MUST return ONLY valid JSON (no markdown fences, no explanation text before or after). Match this exact structure:

{
  "name": "The brand/business name",
  "tagline": "Their main tagline or slogan, or null",
  "voice_description": "3-4 sentence brand voice brief. Describe HOW they write: sentence structure, vocabulary level, emotional register, perspective (first person plural? third person?), formality level. Write this as if briefing a copywriter who needs to ghost-write for them.",
  "brand_personality": "2-3 sentence personality profile. Are they luxury, approachable, bold, minimal, romantic, adventurous, editorial, classic, modern, artsy, corporate? What archetype are they? What would they be like as a person at a dinner party?",
  "style_keywords": ["5-8 adjective keywords describing their overall visual and verbal aesthetic"],
  "tone_presets": ["3-5 tone descriptors like: warm, professional, poetic, casual, bold, elegant, playful, intimate, editorial, witty, reverent, aspirational"],

  "icp_description": "2-3 sentence description of their ideal customer. Who specifically hires/buys from them? Include demographics, psychographics, life stage, and what drives them to seek this service. Be specific, not generic.",
  "target_audience": "One-line audience summary, e.g. 'Affluent couples aged 28-40 planning luxury destination weddings' or 'Small business owners who need professional brand photography'",
  "audience_pain_points": ["3-5 specific pain points or frustrations their ideal client likely has that this brand solves"],
  "audience_desires": ["3-5 specific desires, aspirations, or outcomes their ideal client wants"],
  "niche": "Their specific niche within their industry",
  "service_area": "Geographic service area if mentioned (e.g. 'San Francisco Bay Area', 'Worldwide destination') or null",
  "price_positioning": "One of: budget, mid-range, premium, luxury - based on language, design, and positioning cues",
  "differentiator": "1-2 sentences on what makes this brand different from competitors. What's their unique angle, approach, or value proposition?",

  "color_primary": "#hex - the dominant brand color (used for headings, logo, key accents)",
  "color_secondary": "#hex - the supporting/secondary color",
  "color_accent": "#hex - CTA buttons, highlights, links. null if unclear",
  "color_background": "#hex - main page background color. null if unclear",
  "color_text": "#hex - primary body text color. null if unclear",

  "font_heading": "Best matching Google Font for their heading style. Choose from: Playfair Display, Cormorant Garamond, Libre Baskerville, EB Garamond, Crimson Text, DM Serif Display, Inter, Montserrat, Bebas Neue, Poppins, Raleway, Oswald",
  "font_body": "Best matching Google Font for their body text. Choose from: Lora, Cormorant, Libre Baskerville, Source Serif Pro, Merriweather, Inter, Open Sans, Roboto, Nunito, Work Sans",
  "font_accent": "A suggested accent/decorative font or null",

  "review_count": "Any review or testimonial count mentioned (e.g. '200+ five-star reviews', '50 Google reviews') or null",
  "review_tagline": "A standout testimonial quote or social proof statement, or null",

  "instagram_handle": "@handle if found on the page, or null",
  "website_tagline": "The exact hero/above-the-fold headline text, verbatim from the site",
  "social_links": {"platform": "url"} - object of social media links found (instagram, facebook, tiktok, etc.),
  "logo_url": "Absolute URL to their logo image if found in the HTML, or null"
}

ANALYSIS GUIDELINES:
- For colors: Look at CSS custom properties (--vars), inline styles, and stylesheet rules. Extract ACTUAL hex values when visible. When CSS shows rgb(), convert to hex.
- For fonts: Look at font-family declarations, Google Fonts links, and @import statements. Map what you find to the closest Google Font from the allowed lists.
- For voice: Read their about page text, headlines, and service descriptions carefully. Note specific word choices, sentence patterns, and emotional tone.
- For ICP: Infer from the content who they're targeting. Look at pricing language, service descriptions, location mentions, and the sophistication level of their copy.
- For personality: Consider the overall impression - the intersection of their visual design, copy style, and market positioning.
- Never return generic/vague analysis. Be specific and opinionated. A good brand profile should feel like it could only describe THIS brand.`;

  const userMessage = `Analyze this website completely and build a full brand profile.

URL: ${normalizedUrl}
Page Title: ${titleTag}

Meta Tags:
${metaTags}

Link Tags (fonts, stylesheets):
${linkTags}

CSS Variables Found:
${cssVars}

Sample Inline Styles:
${inlineStyles}

CSS/Style Blocks:
${styleBlocks}

Social Links Found:
${socialLinksRaw.join('\n')}

Page Text Content:
${pageText}`;

  try {
    const aiResponse = await chatCompletion(systemPrompt, userMessage);

    // Parse JSON - handle markdown wrapping
    let jsonStr = aiResponse.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const extraction: BrandExtraction = JSON.parse(jsonStr);

    return NextResponse.json(extraction);
  } catch (err) {
    console.error('AI extraction failed:', err);
    return NextResponse.json(
      { error: 'Failed to analyze website. Please try again or enter your brand details manually.' },
      { status: 500 }
    );
  }
}
