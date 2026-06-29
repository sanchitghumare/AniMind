import searchSimilarAnime from "@/lib/embeddings/searchSimilarAnime";
import extractAnime from "@/lib/Anime/extractAnime";
import retrieveMemories from "@/lib/memory/retrieveMemories";
import { generateLLMResponse } from "@/lib/llm";
export default async function handleRecommendation(userId,message) {
  const memories = await retrieveMemories(userId, message);
  const memoryContext =
    memories.length > 0
      ? memories.map(m => `- ${m.memory}`).join("\n")
      : "No relevant memories.";
  let anime = [];
  const extractedAnime = await extractAnime(message);
  if (extractedAnime) {
     anime=await searchSimilarAnime(extractedAnime, 5);
  } else {
     anime = await searchSimilarAnime(message, 5);
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

  const response = await generateLLMResponse({
    prompt,
  });
 
  const result = await response.json();

  return result.response.trim();
}