import TasteProfile from "@/models/TasteProfile";
import {generateLLMResponse} from "@/lib/llm";

export default async function generateAISummary(userId) {
  try {
    const tasteProfile = await TasteProfile.findOne({ userId });

    if (!tasteProfile) {
      throw new Error("Taste profile not found");
    }

    const { topGenres, topThemes, topRatedAnime } = tasteProfile;

    const prompt = `
        You are an anime taste analyst.

        Analyze the user's anime preferences based on their top genres, themes, and favorite anime.

        Top Genres:
        ${JSON.stringify(topGenres)}

        Top Themes:
        ${JSON.stringify(topThemes)}

        Top Rated Anime:
        ${JSON.stringify(topRatedAnime)}

        Tasks:
        1. Create a short archetype title (max 5 words).
        2. Write a 2-3 sentence summary of the user's anime taste.
        3. Provide exactly 3 short recommendation directions (not anime titles).

        Return ONLY valid JSON in this format:
        Do not include markdown.
        Do not include explanations.
        Do not include anime examples.
        Do not include apostrophes or quotation marks inside values.
        {
        "archetype": "string",
        "summary": "string",
        "recommendationDirections": [
            "string",
            "string",
            "string"
        ]
        }
        `;

    const response = await generateLLMResponse({
      prompt,
      format: "json",
      label: "AI Summary Generation",
    });
            
    const result = await response.json();
    await TasteProfile.findOneAndUpdate(
      { userId },
      {
        archetype: result.archetype,
        aiSummary: result.summary,
        recommendationDirections:
          result.recommendationDirections,
      },
      {
        returnDocument: "after",
      }
    );
    return result;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw error;
  }
}
