import searchSimilarAnime from "@/lib/embeddings/searchSimilarAnime";
import extractAnime from "@/lib/Anime/extractAnime";
import retrieveMemories from "@/lib/memory/retrieveMemories";
export default async function handleRecommendation(message) {
  const memories = await retrieveMemories(userId, message);
  const memoryContext =
    memories.length > 0
      ? memories.map(m => `- ${m.memory}`).join("\n")
      : "No relevant memories.";

  const anime = await extractAnime(message);
  if (anime) {
    await searchSimilarAnime(anime, 5);
  } else {
    const anime = await searchSimilarAnime(message, 5);
  }

  if (!anime.length) {
    return "I couldn't find any suitable anime in my database for your request.";
  }

  const animeContext = anime
    .map(
      (a) => `
      Title: ${a.title}

      Synopsis:
      ${a.synopsis || "No synopsis available."}

      Genres:
      ${a.genres?.map((g) => g.name).join(", ") || "Unknown"}

      Similarity Score:
      ${a.score.toFixed(3)}
      `
    )
    .join("\n-----------------------------\n");

  const prompt = `
      You are AniMind, an intelligent anime recommendation assistant.

      The following anime were retrieved by the semantic search engine as the most relevant matches for the user's request.

      =========================
      LONG TERM MEMORY
      =========================

      ${memoryContext}

      =========================
      RETRIEVED ANIME
      =========================

      ${animeContext}

      =========================
      USER REQUEST
      =========================

      ${message}

      =========================
      RULES
      =========================

      - Recommend ONLY anime from the retrieved list above.
      - Never invent anime titles.
      - Choose the best 3-5 recommendations.
      - Briefly explain why each recommendation matches the user's request.
      - If none of the retrieved anime are suitable, say so honestly.
      - Keep the response under 200 words.
      - Respond naturally like a helpful anime expert.

      Return only the assistant response.
      `;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Ollama Error:", errorText);
    throw new Error(`Ollama API request failed: ${errorText}`);
  }

  const result = await response.json();

  if (!result.response) {
    throw new Error("No response from Ollama.");
  }

  return result.response.trim();
}