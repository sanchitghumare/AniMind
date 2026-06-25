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
        new: true,
      }
    );

    return finalRecommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

export default generateRecommendation;




// import Recommendation from "@/models/Recommendation";
// import TasteProfile from "@/models/TasteProfile";
// import { getRecommendations } from "@/lib/jikan";
// import Watchlist from "@/models/watchlist";
// const generateRecommendation = async (userId) => {
//   try {
//     const tasteProfile = await TasteProfile.findOne({ userId });
//     if (!tasteProfile) {
//       throw new Error("Taste profile not found for the user.");
//     }
//     const { topGenres, topThemes, topRatedAnime } = tasteProfile;
//     const favoriteAnime = tasteProfile.topRatedAnime
//       .sort((a, b) => b.userRating - a.userRating)
//       .slice(0, 3);
//     if (favoriteAnime.length === 0) {
//       throw new Error("Not enough rated anime to generate recommendations.");
//     }
//     let candidates = [];
//     for (const anime of favoriteAnime) {
//       const recs = await getRecommendations(anime.animeId);
//       candidates.push(...recs);
//     }
//     const watchlist = await Watchlist.find({ userId }).select("animeId");
//     const watchedIds = watchlist.map(item => item.animeId);
//     candidates = candidates.filter(
//       anime => !watchedIds.includes(anime.entry.mal_id)
//     );
//     const uniqueCandidates = [
//       ...new Map(
//         candidates.map(anime => [anime.entry.mal_id, anime])
//       ).values()
//     ];
//     candidates = uniqueCandidates;
//     candidates.sort((a, b) => b.votes - a.votes);
//     const cleanedCandidates = candidates.map((anime) => ({
//       animeId: anime.entry.mal_id,
//       title: anime.entry.title,
//       votes: anime.votes,
//     }));
//     const topCandidates = cleanedCandidates.slice(0, 20);
//     console.log(topCandidates);
//     const prompt = `
//             You are AniMind's recommendation engine.

//             Your task is to rank anime recommendations for a user.

//             Use the user's taste profile together with the candidate anime list.

//             ==========================
//             USER TASTE PROFILE
//             ==========================

//             Top Genres:
//             ${JSON.stringify(topGenres)}

//             Top Themes:
//             ${JSON.stringify(topThemes)}

//             Favorite Anime:
//             ${JSON.stringify(favoriteAnime)}

//             ==========================
//             CANDIDATE ANIME
//             ==========================

//             ${JSON.stringify(topCandidates)}

//             Each candidate contains:
//             - animeId
//             - title
//             - community recommendation votes

//             ==========================
//             HOW TO RANK
//             ==========================

//             When ranking, prioritize:

//             1. Similarity to the user's favorite anime.
//             2. Matching psychological themes and storytelling style.
//             3. Matching genres.
//             4. Community recommendation votes.
//             5. Diversity (avoid recommending anime that are too similar to each other).

//             Generate a compatibility score from 0 to 100.

//             Interpretation:

//             95-100 : Nearly perfect recommendation
//             90-94  : Excellent match
//             85-89  : Very good match
//             80-84  : Good match
//             Below 80: Do not include

//             Recommend ONLY anime from the Candidate Anime list.

//             Never invent anime.

//             Never recommend anime outside the provided list.

//             Return ONLY the best 10 recommendations.

//             For each recommendation provide:

//             - animeId
//             - title
//             - compatibilityScore
//             - reason (maximum 20 words)

//             ==========================
//             OUTPUT FORMAT
//             ==========================

//             Return ONLY valid JSON.

//             {
//             "recommendations": [
//                 {
//                 "animeId": 5114,
//                 "title": "Fullmetal Alchemist: Brotherhood",
//                 "compatibilityScore": 98,
//                 "reason": "Outstanding match for your love of emotional storytelling, adventure and strong characters."
//                 }
//             ]
//             }
//             The anime above are already watched by the user.

//             They are ONLY provided to understand the user's taste.

//             DO NOT recommend any anime from the Favorite Anime list.

//             DO NOT recommend any anime outside the Candidate Anime list.

//             Do not output markdown.

//             Do not output explanations.

//             Do not output anything except valid JSON.
//     `;
//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama3.2",
//         prompt,
//         stream: false,
//         format: "json",
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.log("Ollama Error:", errorText);

//       throw new Error(
//         `Ollama API Error: ${response.status} - ${errorText}`
//       );
//     }

//     const data = await response.json();
//     const text = data.response;
//     console.log("Ollama Response Text:", text);
//     if (!text) {
//       throw new Error("No response from Ollama");
//     }
//     const cleanedText = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const result = JSON.parse(cleanedText);
//     const validIds = new Set(topCandidates.map(a => a.animeId));

//     const recommendation = result.recommendations.filter(rec =>
//       validIds.has(Number(rec.animeId))
//     );
//      const recommendations = recommendation.recommendations.map((rec) => {
//       const anime = topCandidates.find(
//         (candidate) => candidate.animeId === rec.animeId
//       );
//       console.log("Searching for:", rec.animeId);
//       console.log("Found:", anime);

//       return {
//         ...rec,
//         title: anime.title,
//         image: anime.image,
//       };
//     });
//     await Recommendation.findOneAndUpdate(
//       { userId },
//       {
//         recommendations: recommendations.recommendations,
//         generatedAt: new Date(),
//       },
//       { upsert: true, new: true }
//     );
//   } catch (error) {
//     console.error("Error generating recommendations:", error);
//     throw error;
//   }
// };
// export default generateRecommendation;