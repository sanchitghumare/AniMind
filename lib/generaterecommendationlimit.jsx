import { recommendationRateLimit } from "@/lib/ratelimit";
import generateRecommendation from "@/lib/generateRecommendation";
export async function generateRecommendationsWithLimit(userId) {
    const { success } = await recommendationRateLimit.limit(userId.toString());

    if (!success) {
        throw new Error("Recommendation rate limit exceeded.");
    }

    return generateRecommendation(userId);
}