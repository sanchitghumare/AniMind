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

    switch (intent) {
        case "watchlist":
            return await handleWatchlist(userId, message);

        case "profile":
            return await handleProfile(userId);

        case "search":
            return await handleSearch(message);

        case "recommend":
            return await handleRecommendation(userId, message);

        default:
            return await handleGeneralChat(userId, message);
    }
}
