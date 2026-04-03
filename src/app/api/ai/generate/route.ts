import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';
import { buildGeneratePrompt } from '@/lib/ai/prompts';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId, vibe, idea, slideNumber, totalSlides, feedback, analyzeImage, imageUrl } = await request.json();

  if (!brandId || !vibe) {
    return NextResponse.json({ error: 'brandId and vibe are required' }, { status: 400 });
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('name, voice_description, tone_presets')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single();

  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }

  const hasImage = analyzeImage && imageUrl;

  const systemPrompt = buildGeneratePrompt(brand, vibe, {
    idea: idea || undefined,
    slideNumber: slideNumber || undefined,
    totalSlides: totalSlides || undefined,
    feedback: feedback || undefined,
    analyzeImage: !!hasImage,
  });

  let userMessage = idea
    ? `Generate a headline and body for a ${vibe.toLowerCase()} slide for ${brand.name}. The content should be about: ${idea}`
    : `Generate a headline and body for a ${vibe.toLowerCase()} slide for ${brand.name}.`;

  if (hasImage) {
    userMessage += ' Analyze the attached photo and make the text relate to what you see.';
  }

  const imageUrls = hasImage ? [imageUrl] : undefined;
  const text = await chatCompletion(systemPrompt, userMessage, imageUrls);

  // Parse JSON from response
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      headline: parsed.headline || '',
      body: parsed.body || '',
    });
  } catch {
    return NextResponse.json({
      headline: 'Authentic, Present, Devoted',
      body: text.slice(0, 200),
    });
  }
}
