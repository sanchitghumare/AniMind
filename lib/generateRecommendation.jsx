import Recommendation from "@/models/Recommendation";
import TasteProfile from "@/models/TasteProfile";
import Watchlist from "@/models/watchlist";
import { getRecommendations } from "@/lib/jikan";

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
    let candidates = [];

    for (const anime of favoriteAnime) {
      const recs = await getRecommendations(anime.animeId);

      if (Array.isArray(recs)) {
        candidates.push(...recs);
      }
    }

  
    const watchlist = await Watchlist.find({ userId }).select("animeId");

    const watchedIds = new Set(
      watchlist.map((anime) => Number(anime.animeId))
    );

    candidates = candidates.filter(
      (anime) => !watchedIds.has(Number(anime.entry.mal_id))
    );

   
    candidates = [
      ...new Map(
        candidates.map((anime) => [anime.entry.mal_id, anime])
      ).values(),
    ];

   

    candidates.sort((a, b) => b.votes - a.votes);


    const topCandidates = candidates
      .slice(0, 20)
      .map((anime) => ({
        animeId: anime.entry.mal_id,
        title: anime.entry.title,
        image: anime.entry.images?.jpg?.image_url || "",
        votes: anime.votes,
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
      - Return ONLY the best 10 recommendations.

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
      throw new Error(`Ollama Error ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("No response from Ollama");
    }

    const result = JSON.parse(
      data.response.replace(/```json/g, "").replace(/```/g, "").trim()
    );

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