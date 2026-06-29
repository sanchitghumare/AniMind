import ConnectDb from "@/lib/mongodb";
import planner from "./Agents/planner";
import executor from "./Agents/Executor";
import handleWatchlist from "./chat/handleWatchlist";
import handleProfile from "./chat/handleProfile";
import handleSearch from "./chat/handleSearch";
import handleRecommendation from "./chat/handleRecommendation";
import handleGeneralChat from "./chat/handleGeneralChat";
import saveMemory from "./memory/saveMemory";
export default async function generateChatResponse(message, userId) {
    await ConnectDb();

    const plan = await planner(message);
    // Execute tool if needed
    if (plan.tool !== "none") {
        const result = await executor(userId, plan);

        return result.success
            ? result.result.message
            : result.message;
    }

    let response;

    switch (plan.intent) {
        case "watchlist":
            response = await handleWatchlist(userId, message);
            break;

        case "profile":
            response = await handleProfile(userId);
            break;

        case "search":
            response = await handleSearch(message);
            break;

        case "recommend":
            response = await handleRecommendation(userId, message);
            break;

        default:
            response = await handleGeneralChat(userId, message);
            if (plan.shouldSaveMemory) {
                try {
                    await saveMemory(userId, message);
                } catch (err) {
                    console.error("Memory save failed:", err);
                }
            }

            break;
    }
    return response;
}