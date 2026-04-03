export function buildGeneratePrompt(brand: {
  name: string;
  voice_description: string | null;
  tone_presets: string[];
}, vibe: string, options?: {
  idea?: string;
  slideNumber?: number;
  totalSlides?: number;
  feedback?: string;
  analyzeImage?: boolean;
}): string {
  const ideaSection = options?.idea
    ? `\nContent idea/topic: ${options.idea}\nBase the headline and body text on this idea. Adapt the messaging to reflect this specific topic while maintaining brand voice.`
    : '';

  const slideContext = options?.slideNumber && options?.totalSlides
    ? `\nThis is slide ${options.slideNumber} of ${options.totalSlides} in a carousel.${
        options.slideNumber === 1 ? ' This is the opening slide — make it attention-grabbing.' :
        options.slideNumber === options.totalSlides ? ' This is the final slide — include a call to action or closing thought.' :
        ' Continue the narrative flow from previous slides.'
      }`
    : '';

  const feedbackSection = options?.feedback
    ? `\nUser feedback on previous generation: "${options.feedback}"\nAdjust your output based on this feedback.`
    : '';

  const imageAnalysisSection = options?.analyzeImage
    ? `\nIMPORTANT: An image is attached. Analyze the photo and make the text relate to what you see in it.
- Identify the mood, setting, subjects, colors, and emotion in the photo
- Write the headline and body to broadly complement and reflect what the image shows
- Do NOT describe the image literally — instead capture its feeling and essence in the copy
- The text should feel like it was written specifically for this image`
    : '';

  return `You are an expert copywriter for ${brand.name}.

Brand voice: ${brand.voice_description || 'Professional, elegant, and emotionally resonant'}
Brand tone presets: ${brand.tone_presets.length ? brand.tone_presets.join(', ') : 'Warm and authentic'}
Vibe for this slide: ${vibe}${ideaSection}${slideContext}${feedbackSection}${imageAnalysisSection}

Generate a headline and body paragraph for a social media carousel slide.

HEADLINE RULES:
- 2-5 words maximum
- Bold, emotional, evocative
- ALL UPPERCASE style (but return in normal case, the template handles caps)
- Should evoke the feeling of ${vibe} content
- Use comma-separated descriptors (e.g. "Invisible, Present, Devoted" or "Authentic, Present, Documentary")

BODY RULES:
- 2-3 sentences maximum
- Poetic, elegant italic style
- Speak to the brand's audience who want ${vibe} content
- Use "We" voice as the brand
- Include sensory details and emotional hooks

Return ONLY a JSON object with no other text:
{ "headline": "...", "body": "..." }`;
}
