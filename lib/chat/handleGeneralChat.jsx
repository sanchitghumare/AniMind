import TasteProfile from "@/models/TasteProfile";
import Recommendation from "@/models/Recommendation";
import Watchlist from "@/models/watchlist";
import ConnectDb from "@/lib/mongodb";
import Chat from "@/models/chat";
import retrieveMemories from "@/lib/memory/retrieveMemories";
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
    const recommendations = await Recommendation.findOne({ userId })
    if (recommendations.length === 0) {
        return "I don't have any recommendations for you yet. Rate a few anime first!";
    }
    const { topGenres, topThemes, topRatedAnime } = tasteProfile;
    const watchlist = await Watchlist.find({ userId }).select(" title status userRating");
    const chat = await Chat.findOne({ userId });
    const history = chat?.messages.slice(-10) || [];
    const prompt = `
       ROLE

        You are AniMind, a conversational anime assistant.

        You should behave naturally.

        Examples:

        If the user greets you:
        - Greet them back.
        - Do not recommend anime.

        If the user asks about anime:
        - Answer the question.

        If the user asks for recommendations:
        - Use the user's taste profile and recommendations.

        If the user asks why they received a recommendation:
        - Explain your reasoning.

        If the user asks about genres, studios, characters, episodes, or anime trivia:
        - Answer normally.

        Only recommend anime when the user explicitly asks for recommendations or when it naturally helps answer the question.

        Your purpose is to help users discover anime based on their personal taste.

        You MUST personalize every answer using the user's profile below.

        =========================
        USER TASTE PROFILE
        =========================

        Top Genres:
        ${JSON.stringify(topGenres)}

        Top Themes:
        ${JSON.stringify(topThemes)}

        Favorite Anime:
        ${JSON.stringify(topRatedAnime)}

        Current AI Recommendations (ordered from best match to lowest match):
        ${JSON.stringify(recommendations.recommendations.slice(0, 5))}

        -The recommendations are already ranked by compatibility score.
        -Prefer recommending higher-ranked anime unless a lower-ranked anime is a significantly better answer to the user's specific question.


        Already Watched Anime:
        ${JSON.stringify(watchlist || [])}

        =========================
        LONG TERM MEMORY
        =========================

        ${memoryContext}
        =========================
         CONVERSATION HISTORY
        =========================

        ${history
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")}

        =========================
        USER QUESTION
        =========================

        ${message}

        =========================
        RULES
        =========================

        - Always answer in a friendly conversational tone.
        - Keep answers concise (under 200 words unless asked otherwise).
        - Personalize every recommendation using the user's taste profile.
        - Prefer anime from the Current AI Recommendations whenever they fit the user's question.
        - Never recommend anime that appears in the Favorite Anime list unless the user specifically asks about it.
        - If the user asks "why", explain your reasoning using genres, themes, and favorite anime.
        - If the user asks for recommendations outside their usual taste, clearly mention that it differs from their profile.
        - If the question is unrelated to anime, politely explain that you are an anime assistant and redirect the conversation back to anime.
       - Keep responses under 120 words unless the user explicitly asks for a detailed explanation.
       -Use short paragraphs.

        When recommending anime:
        - Mention 3 anime at most.
        - Explain each recommendation in one short sentence.
        - Never invent anime titles.
        - Never invent facts about an anime.

        If the user asks about their own taste:
        - Use the provided taste profile.
        - Explain patterns you notice.
        - Mention genres and themes they seem to enjoy.
        -ONLY recommend anime from the Current AI Recommendations list.
        -If none of them fit the user's request, explain why instead of inventing new recommendations.

        Respond naturally.

        Do NOT output JSON.

        Do NOT use markdown code blocks.

        Return only the assistant's reply.
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
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.log("Ollama Error:", errorText);
        throw new Error(`Ollama API request failed: ${errorText}`);
    }
    const result = await response.json();
    const text = result.response
    if (!text) {
        throw new Error("No response from Ollama");
    }
    return text.trim();
}