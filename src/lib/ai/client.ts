const KIEAI_LLM_BASE = 'https://api.kie.ai/gemini-2.5-flash/v1/chat/completions';

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  imageUrls?: string[]
): Promise<string> {
  const key = process.env.KIEAI_API_KEY;
  if (!key) throw new Error('KIEAI_API_KEY not configured');

  // Build user content parts: text + optional images
  const userContent: ContentPart[] = [{ type: 'text', text: userMessage }];
  if (imageUrls?.length) {
    for (const url of imageUrls) {
      userContent.push({ type: 'image_url', image_url: { url } });
    }
  }

  const res = await fetch(KIEAI_LLM_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
        { role: 'user', content: userContent },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kie.ai LLM failed: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
