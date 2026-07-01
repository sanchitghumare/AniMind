import Recommendation from "@/models/Recommendation";
import TasteProfile from "@/models/TasteProfile";
import Watchlist from "@/models/watchlist";
import { getRecommendations } from "@/lib/jikan";
import Anime from "@/models/Anime";
import searchSimilarAnime from "@/lib/embeddings/searchSimilarAnime";
import { generateLLMResponse } from "@/lib/llm";
const generateRecommendation = async (userId) => {
  
  try {
    const tasteProfile = await TasteProfile.findOne({ userId });

    if (!tasteProfile) {
      throw new Error("Taste profile not found.");
    }

    const { topGenres, topThemes } = tasteProfile;

    const favoriteAnime = [...tasteProfile.topRatedAnime]
      .sort((a, b) => b.userRating - a.userRating)
      .slice(0, 3);

    if (favoriteAnime.length === 0) {
      throw new Error("Not enough rated anime.");
    }

    const combinedQuery = `
      Favorite Genres:
      ${topGenres.map(g => g.name).join(", ")}

      Favorite Themes:
      ${topThemes.map(t => t.name).join(", ")}

      Favorite Anime:
      ${favoriteAnime
        .map(
          anime => `
      Title: ${anime.title}
      User Rating: ${anime.userRating}/10`
        )
        .join("\n")}
      `;

    let candidates = await searchSimilarAnime(combinedQuery, 30);
    const watchlist = await Watchlist.find({ userId }).select("animeId");

    const watchedIds = new Set(
      watchlist.map((anime) => Number(anime.animeId))
    );

    candidates = candidates.filter(
      (anime) => !watchedIds.has(Number(anime.animeId))
    );
    const unique = new Map();
    for (const anime of candidates) {
      const existing = unique.get(anime.animeId);

      if (!existing || anime.score > existing.score) {
        unique.set(anime.animeId, anime);
      }
    }
    candidates = [...unique.values()];

    candidates.sort((a, b) => b.score - a.score);
    const topCandidates = candidates
      .slice(0, 20)
      .map((anime) => ({
        animeId: anime.animeId,
        title: anime.title,
        image: anime.image,
        synopsis: anime.synopsis,
        genres: anime.genres,
        similarityScore: anime.score,
      }));

    /* ------------------------------
       Prompt
    ------------------------------ */

    const prompt = `
      You are AniMind's recommendation engine.

      USER PROFILE

      Top Genres:
      ${JSON.stringify(topGenres)}

      Top Themes:
      ${JSON.stringify(topThemes)}

      Favorite Anime:
      ${JSON.stringify(favoriteAnime)}

      Candidate Anime:
      ${JSON.stringify(topCandidates)}

      IMPORTANT RULES

      - Recommend ONLY anime from Candidate Anime.
      - Never recommend anime from Favorite Anime.
      - Never invent anime.
      - Every animeId MUST exactly match one candidate anime.
      - Return ONLY EXACTLY the best 10 recommendations.

      Return ONLY JSON.

      {
        "recommendations":[
          {
            "animeId":1575,
            "compatibilityScore":96,
            "reason":"Short explanation."
          }
        ]
      }
      `;



    const response = await generateLLMResponse({
      prompt,
      format: "json",
      label: "Recommendation Generation",
    });
  
    const result = JSON.parse(response);
    const validIds = new Set(
      topCandidates.map((anime) => Number(anime.animeId))
    );
    const uniqueRecommendations = [
      ...new Map(
        result.recommendations.map((rec) => [
          Number(rec.animeId),
          rec,
        ])
      ).values(),
    ];
    const finalRecommendations = uniqueRecommendations
      .filter((rec) => validIds.has(Number(rec.animeId)))
      .map((rec) => {
        const anime = topCandidates.find(
          (candidate) =>
            Number(candidate.animeId) === Number(rec.animeId)
        );

        return {
          animeId: anime.animeId,
          title: anime.title,
          image: anime.image,
          compatibilityScore: rec.compatibilityScore,
          reason: rec.reason,
        };
      });
  
    await Recommendation.findOneAndUpdate(
      { userId },
      {
        recommendations: finalRecommendations,
        generatedAt: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return finalRecommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

export default generateRecommendation;