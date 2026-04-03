const KIEAI_LLM_BASE = 'https://api.kie.ai/claude-opus-4-6/v1/chat/completions';

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const key = process.env.KIEAI_API_KEY;
  if (!key) throw new Error('KIEAI_API_KEY not configured');

  const res = await fetch(KIEAI_LLM_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
        { role: 'user', content: [{ type: 'text', text: userMessage }] },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kie.ai Opus 4.6 failed: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
