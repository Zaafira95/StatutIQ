const CLAUDE_API_URL = "https://api.anthropic.com/v1/complete";

export async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("Clé API Claude manquante");
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-2",
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      max_tokens_to_sample: 1200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  const data = await response.json();
  return data.completion;
}
