// planner.js
import { generateLLMResponse } from "@/lib/llm";
export default async function planner(message) {
  const prompt = `
You are an AI planner for AniMind.

You have only these Available tools:

1. addToWatchlist(animeTitle)
2. removeFromWatchlist(animeTitle)
3. updateWatchlistStatus(animeTitle, status)
4. rateAnime(animeTitle, rating)

If one tool should be used, return ONLY valid JSON.

Example:

{
  "tool": "addToWatchlist",
  "arguments": {
    "animeTitle": "Naruto"
  }
}

Another example:

{
  "tool": "rateAnime",
  "arguments": {
    "animeTitle": "Monster",
    "rating": 10
  }
}

If none of these tools can satisfy the user's request, return

{
  "tool": "none",
  "arguments": {}
}
Never invent tool names.
Never output any tool except the four listed above or "none".

User message:

${message}
`;

  const response = await generateLLMResponse({
    prompt,
    format: "json"
  });
 
  return JSON.parse(response);
}