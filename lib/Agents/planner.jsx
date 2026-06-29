import { generateLLMResponse } from "@/lib/llm";
export default async function planner(message) {
  const prompt = `
      You are AniMind's routing planner.

    Return ONLY valid JSON.

    Determine:

    1. intent
    2. tool
    3. shouldSaveMemory

    Intents:
    - chat
    - search
    - recommend
    - watchlist
    - profile

    Tools:
    - addToWatchlist(animeTitle)
    - removeFromWatchlist(animeTitle)
    - updateWatchlistStatus(animeTitle,status)
    - rateAnime(animeTitle,rating)
    if no tool is needed, return "none".

    Rules

    • Questions about anime → search
    • Recommendation requests → recommend
    • Questions about the user's preferences, memories or previous conversations → chat
    • Watchlist modifications → corresponding tool + watchlist
    • Profile/taste analysis → profile
    
    When extracting animeTitle:

    - Copy the anime title exactly as written by the user.
    - Do NOT expand abbreviations.
    - Do NOT guess a more specific title.
    - Do NOT replace it with a movie, sequel, OVA, or related work.
    - Do NOT normalize or autocomplete titles.
    - Preserve the user's wording exactly.

    Example:

    User: Add Naruto
    animeTitle = "Naruto"

    User: Add AOT
    animeTitle = "AOT"

    User: Add FMAB
    animeTitle = "FMAB"

    shouldSaveMemory=true ONLY if the user provides new long-term information such as:
    - name
    - preference
    - favorite
    - dislike
    - goal
    - long-term interest
    - stable personal fact

    Otherwise false.

    Return

    {
    "tool":"",
    "intent":"",
    "shouldSaveMemory":false,
    "arguments":{}
    }

    User:

    ${message}
    `;

  const response = await generateLLMResponse({
    prompt,
    format: "json",
    label: "Planner",
  });

  try {
    const plan = JSON.parse(response);

    return {
      tool: plan.tool ?? "none",
      intent: plan.intent ?? "chat",
      shouldSaveMemory: plan.shouldSaveMemory,
      arguments: plan.arguments ?? {},
    };
  } catch (error) {
    console.error("Planner JSON error:", error);

    return {
      tool: "none",
      intent: "chat",
      shouldSaveMemory: false,
      arguments: {},
    };
  }
}