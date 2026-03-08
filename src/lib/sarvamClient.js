const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY;

const SYSTEM_PROMPT = `You are a friendly and knowledgeable study assistant for students using StudyTracker. 
Help students with:
- Understanding difficult concepts across any subject
- Study tips, techniques, and time management advice
- Breaking down complex topics into simpler explanations
- Motivational support during tough study sessions

Keep responses concise, clear, and encouraging. Use examples when helpful.`;

export async function sendChatMessage(messages) {
  const payload = {
    model: 'sarvam-m',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };

  const res = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': SARVAM_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sarvam AI error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
}
