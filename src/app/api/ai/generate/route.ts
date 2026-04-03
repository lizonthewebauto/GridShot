import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';
import { buildGeneratePrompt } from '@/lib/ai/prompts';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brandId, vibe } = await request.json();

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

  const systemPrompt = buildGeneratePrompt(brand, vibe);

  const text = await chatCompletion(
    systemPrompt,
    `Generate a headline and body for a ${vibe.toLowerCase()} photography slide for ${brand.name}.`
  );

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
