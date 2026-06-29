import TasteProfile from "@/models/TasteProfile";
import Recommendation from "@/models/Recommendation";
import Watchlist from "@/models/watchlist";
import ConnectDb from "@/lib/mongodb";
import Chat from "@/models/chat";
import retrieveMemories from "@/lib/memory/retrieveMemories";
import { generateLLMResponse } from "@/lib/llm";
export default async function handleGeneralChat(userId, message) {
    await ConnectDb();
    const memories = await retrieveMemories(userId, message);

    const memoryContext =
        memories.length > 0
            ? memories.map(m => `- ${m.memory}`).join("\n")
            : "No relevant memories.";
    const tasteProfile = await TasteProfile.findOne({ userId });
    if (!tasteProfile) {
        return "I don't know your anime taste yet. Rate a few anime first!";
    }
    const recommendations = await Recommendation.findOne({ userId });
    if (!recommendations || recommendations.length === 0) {
        return "I don't have any recommendations for you yet. Rate a few anime first!";
    }
    const { topGenres, topThemes, topRatedAnime } = tasteProfile;
    const watchlist = await Watchlist.find({ userId }).select(" title status userRating");
    const formattedTopGenres =
        topGenres
            .map(g => `${g.name} (${g.score})`)
            .join(", ");
    const formattedTopRatedAnime =
        topRatedAnime
            .map(a => `${a.title} (${a.userRating}/10)`)
            .join(", ");
    const formattedWatchlist =
        watchlist
            .map(a => a.title)
            .join(", ");
    const formattedRecommendations =
        recommendations.recommendations
            .slice(0, 5)
            .map(
                r =>
                    `${r.title} (${r.compatibilityScore}%): ${r.reason}`
            )
            .join("\n");
    const formattedTopThemes =
        topThemes
            .map(t => `${t.name} (${t.score})`)
            .join(", ");        
    const chat = await Chat.findOne({ userId });
    const history = chat?.messages.slice(-10) || [];
    const prompt = `
       You are AniMind, an intelligent conversational anime assistant.

        Your goal is to help users discover, understand, and discuss anime while personalizing responses using the provided user context.

        =========================
        USER PROFILE
        =========================

        Top Genres:
        ${formattedTopGenres}

        Top Themes:
        ${formattedTopThemes}

        Favorite Anime:
        ${formattedTopRatedAnime}

        Recommended Anime (highest compatibility first):
        ${formattedRecommendations}

        Already Watched:
        ${formattedWatchlist}

        =========================
        LONG-TERM MEMORY
        =========================

        ${memoryContext}

        =========================
        RECENT CONVERSATION
        =========================

        ${history
            .slice(-8)
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n")}

        =========================
        USER MESSAGE
        =========================

        ${message}

        =========================
        INSTRUCTIONS
        =========================

        General Behavior
        - Be friendly, conversational, and concise.
        - Use short paragraphs.
        - Unless asked otherwise, keep replies under 120 words.
        - Personalize responses whenever the user's profile or memories are relevant.

        Anime Knowledge
        - Answer anime-related questions accurately.
        - Never invent anime, characters, studios, episodes, or facts.
        - If information is unavailable, clearly say so.

        Recommendations
        - Only recommend anime when the user asks for recommendations or when a recommendation naturally improves the answer.
        - Prefer anime from the provided Recommended Anime list.
        - Recommend at most three anime.
        - Give one short reason for each recommendation.
        - Never recommend anime already present in Favorite Anime unless the user specifically asks about it.
        - If none of the provided recommendations fit the request, explain why instead of inventing alternatives.

        User Profile Questions
        - When discussing the user's taste, use the provided genres, themes, favorite anime, recommendations, memories, and watch history.
        - Explain observable patterns instead of making unsupported assumptions.
        - If the user asks why something was recommended, explain using genres, themes, favorite anime, and compatibility with their taste profile.

        Non-Anime Requests
        - If a request is unrelated to anime, politely explain that AniMind specializes in anime while remaining helpful when appropriate.

        Respond with plain text only.`;
    const response = await generateLLMResponse({
        prompt,
        label: "General Chat",
    });
    return response;
}