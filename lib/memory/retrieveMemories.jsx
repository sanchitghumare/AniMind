import mongoose from "mongoose";
import ConnectDb from "@/lib/mongodb";
import Memory from "@/models/Memory";

export default async function retrieveMemories(userId, query, limit=5) {
  await ConnectDb();
  if (!query?.trim()) {
    return [];
  }

  const memories = await Memory.aggregate([
    {
      $vectorSearch: {
        index: "memory_vector_search",
        path: "embeddingText",
        query,
        limit,
        numCandidates: 50,
        // filter: {
        //   userId: new mongoose.Types.ObjectId(userId),
        // },
      },
    },
    {
      $project: {
        _id: 0,
        memory: 1,
        category: 1,
        importance: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  memories.sort((a, b) => {
    const scoreA = a.score * a.importance;
    const scoreB = b.score * b.importance;

    return scoreB - scoreA;
  });

  return memories;
}