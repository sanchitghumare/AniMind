export async function generateLLMResponse({
  prompt,
  model = process.env.OLLAMA_MODEL ,
  format,
  temperature,
}) {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(process.env.OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        ...(format && { format }),
        ...(temperature !== undefined && { temperature }),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM Error: ${error}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("No response from LLM.");
    }

    return data.response.trim();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("LLM request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}