export async function generateLLMResponse({
  prompt,
  model = process.env.GROQ_MODEL,
  format,
  temperature,
  label = 'LLM Response',
}) {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          ...(temperature !== undefined && { temperature }),
          ...(format === "json" && {
            response_format: { type: "json_object" },
          }),
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM Error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    if (!content) {
      throw new Error("No response from LLM.");
    }

    return content.trim();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("LLM request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}