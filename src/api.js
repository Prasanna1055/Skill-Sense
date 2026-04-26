/**
 * SkillSense — Claude API wrapper
 * Handles all communication with the Anthropic API
 */

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2000;

const JSON_SYSTEM = 'You are SkillSense. Always respond with valid JSON only. No markdown, no preamble, no explanation — just the raw JSON object.';

/**
 * Call the Claude API with a single user message
 * @param {string} userMessage - The user prompt
 * @param {string} [system] - Optional system prompt
 * @returns {Promise<string>} Raw text response
 */
export async function callClaude(userMessage, system = JSON_SYSTEM) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `API error: ${response.status}`);
  }

  return data.content[0].text;
}

/**
 * Parse JSON from Claude response, stripping any accidental markdown fences
 */
export function parseClaudeJSON(raw) {
  const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export { MODEL };
