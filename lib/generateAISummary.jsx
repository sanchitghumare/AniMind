import TasteProfile from "@/models/TasteProfile";

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

    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.2",
            prompt,
            stream: false,
            format: "json",
        }),
        });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.log("Ollama Error:", errorText);

        throw new Error(
            `Ollama API Error: ${response.status} - ${errorText}`
        );
    }

    const data = await response.json();
    // console.log("Ollama Response Data:", data);
    const text = data.response;
    console.log("Ollama Response Text:", text);
    if (!text) {
      throw new Error("No response from Ollama");
    }

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

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
