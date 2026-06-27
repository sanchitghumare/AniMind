import ConnectDb from "@/lib/mongodb";
import Anime from "@/models/Anime";

export default async function searchSimilarAnime(query, limit = 5) {
  await ConnectDb();

  const results = await Anime.aggregate([
    {
      $vectorSearch: {
        index: "anime_vector_search",
        path: "embeddingText",
        query: query,
        limit: limit,
        numCandidates: 100,
      },
    },
    {
      $project: {
        _id: 0,
        animeId: 1,
        title: 1,
        synopsis: 1,
        image: 1,
        genres: 1,
        themes: 1,
        studios: 1,
        episodes: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}