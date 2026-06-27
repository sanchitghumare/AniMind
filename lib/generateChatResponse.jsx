import ConnectDb from "@/lib/mongodb";
import planner from "./Agents/planner";
import executor from "./Agents/Executor";
import detectIntent from "@/lib/detectIntent";
import handleWatchlist from "./chat/handleWatchlist";
import handleProfile from "./chat/handleProfile";
import handleSearch from "./chat/handleSearch";
import handleRecommendation from "./chat/handleRecommendation";
import handleGeneralChat from "./chat/handleGeneralChat";
import isActionRequest from "./Agents/isActionRequest";
import saveMemory from "./memory/saveMemory";
export default async function generateChatResponse(message, userId) {
    await ConnectDb();

    if (isActionRequest(message)) {
        const plan = await planner(message);
        console.log("Plan:", plan);
        if (plan.tool !== "none") {
            const result = await executor(userId, plan);
            if (result.success) {
                return result.result.message;
            }

            return result.message;
        }
    }
    const intent = detectIntent(message);

    let response;

    switch (intent) {
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
    }

    await saveMemory(userId, message);

    return response;
}
