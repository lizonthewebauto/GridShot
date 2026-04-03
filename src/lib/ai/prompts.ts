export function buildGeneratePrompt(brand: {
  name: string;
  voice_description: string | null;
  tone_presets: string[];
}, vibe: string): string {
  return `You are an expert copywriter for ${brand.name}, a photography studio/brand.

Brand voice: ${brand.voice_description || 'Professional, elegant, and emotionally resonant'}
Brand tone presets: ${brand.tone_presets.length ? brand.tone_presets.join(', ') : 'Warm and authentic'}
Vibe for this slide: ${vibe}

Generate a headline and body paragraph for a social media carousel slide.

HEADLINE RULES:
- 2-5 words maximum
- Bold, emotional, evocative
- ALL UPPERCASE style (but return in normal case, the template handles caps)
- Should evoke the feeling of ${vibe} photography
- Use comma-separated descriptors (e.g. "Invisible, Present, Devoted" or "Authentic, Present, Documentary")

BODY RULES:
- 2-3 sentences maximum
- Poetic, elegant italic style
- Speak to couples/clients who want ${vibe} documentation of their moments
- Use "We" voice as the photography studio
- Include sensory details about the photography experience

Return ONLY a JSON object with no other text:
{ "headline": "...", "body": "..." }`;
}
