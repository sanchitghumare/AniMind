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
  const VALID_CATEGORIES = [
    "preference",
    "favorite",
    "goal",
    "fact",
    "dislike",
  ];
  const validMemories = memories.filter(
    (m) =>
      m.memory?.trim() &&
      VALID_CATEGORIES.includes(m.category) &&
      Number.isFinite(m.importance)&&
      m.subject?.trim()
  );

  for (const memory of validMemories) {
    const existing = await Memory.findOne({
      userId,
      subject: memory.subject,
    });
    const importance = Math.max(
      1,
      Math.min(10, Number(memory.importance))
    );
    if (existing) {
      existing.importance = Math.max(
        existing.importance,
        importance
      );
      existing.memory = memory.memory;
      existing.embeddingText = memory.memory;
      existing.category = memory.category;
      existing.importance = Math.max(existing.importance, memory.importance);
      existing.subject = memory.subject;
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
      importance,
      subject: memory.subject,
    });
    saved.push(created);
  }

  return saved;
}