import { generateLLMResponse } from "@/lib/llm";
export default async function extractMemory(message) {
  const prompt = `
    You are AniMind's long-term memory extractor.

Extract ONLY persistent information about the user that would be useful in future conversations.

Do NOT extract:
- Greetings
- Temporary requests
- Questions
- Anime search queries
- Commands like "add Naruto to my watchlist"
- Casual conversation
- Information that is unlikely to matter later

For each memory return:

- memory
- category
- subject
- importance

Definitions:

memory
A concise fact to remember.

category
One of:
- preference
- favorite
- goal
- fact
- dislike

subject
A stable identifier describing what this memory is about.

Examples:
- name
- favorite_genre
- favorite_anime
- favorite_character
- favorite_studio
- favorite_director
- preferred_length
- dislikes_horror
- goal
- occupation

If a new memory has the same subject as an older memory,
it should REPLACE the old one.

importance
Integer from 1 to 10.

Examples

User:
My name is Sanchit.

{
  "memories": [
    {
      "memory": "User's name is Sanchit.",
      "category": "fact",
      "subject": "name",
      "importance": 10
    }
  ]
}

User:
My favorite genre is Action.

{
  "memories": [
    {
      "memory": "User's favorite genre is Action.",
      "category": "favorite",
      "subject": "favorite_genre",
      "importance": 8
    }
  ]
}

User:
Actually I like Psychological more than Action.

{
  "memories": [
    {
      "memory": "User's favorite genre is Psychological.",
      "category": "favorite",
      "subject": "favorite_genre",
      "importance": 9
    }
  ]
}

User:
Hello!

{
  "memories": []
}

Return ONLY valid JSON.

{
  "memories": [
    {
      "memory": "...",
      "category": "...",
      "subject": "...",
      "importance": 7
    }
  ]
}
  User message:
    ${message}
`;

  const response = await generateLLMResponse({
    prompt,
    format: "json",
    label: "Memory Extraction",
  });
  let result;

  try {
    result = JSON.parse(
      response.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    throw new Error("Invalid JSON returned while extracting memories.");
  }
  return result.memories ?? [];

}