import ConnectDb from "@/lib/mongodb";
import Memory from "@/models/Memory";
import extractMemory from "./extractMemory";

export default async function saveMemory(userId, message) {
  await ConnectDb();

  const memories = await extractMemory(message);

  if (!memories.length) {
    return [];
  }

  const saved = [];

  for (const memory of memories) {
    const existing = await Memory.findOne({
      userId,
      memory: memory.memory,  
    });

    if (existing) {
      existing.importance = Math.max(
        existing.importance,
        memory.importance
      );

      existing.updatedAt = new Date();

      await existing.save();

      saved.push(existing);

      continue;
    }

    const created = await Memory.create({
      userId,
      memory: memory.memory,
      embeddingText: memory.memory,
      category: memory.category,
      importance: memory.importance,
    });
    saved.push(created);
  }

  return saved;
}