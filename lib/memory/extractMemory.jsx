export default async function extractMemory(message) {
  const prompt = `
You are AniMind's long-term memory manager.

Your job is to decide whether the user's latest message contains information worth remembering for future conversations.

Remember ONLY durable information such as:

- Favourite anime
- Favourite genres
- Favourite themes
- Favourite studios
- Likes
- Dislikes
- Long-term goals
- Stable preferences
- Personal facts that help future recommendations
  (for example: name, occupation, education, hobbies, preferred language)

Do NOT remember:

- Greetings
- Small talk
- Temporary requests
- Questions
- One-time actions
- Information already obvious from context

Each memory should be a complete, standalone sentence that still makes sense weeks later.

Good:
- "The user's favorite anime is Monster."
- "The user prefers psychological thriller anime."

Bad:
- "Likes Monster."
- "Psychological."
- "Favorite studio."
Return ONLY valid JSON.

Schema:

{
  "memories": [
    {
      "memory": "...",
      "category": "preference",
      "importance": 0.9
    }
  ]
}

Allowed categories:

- preference
- dislike
- favorite
- goal
- fact

If nothing should be remembered, return:

{
  "memories":[]
}

User message:

${message}
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
    throw new Error("Failed to extract memories.");
  }

  const data = await response.json();

  if (!data.response) {
    return [];
  }

  const result = JSON.parse(
    data.response.replace(/```json/g, "").replace(/```/g, "").trim()
  );

  return result.memories ?? [];
}