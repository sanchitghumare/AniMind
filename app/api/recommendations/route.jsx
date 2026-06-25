import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import TasteProfile from "@/models/TasteProfile";
import ConnectDb from "@/lib/mongodb";
import Recommendation from "@/models/Recommendation";
import generateRecommendation from "@/lib/generateRecommendation";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    await ConnectDb();

    let recommendation = await Recommendation.findOne({
        userId: session.user.id,
    });

    if (!recommendation) {
        const recommendations = await generateRecommendation(session.user.id);

        return NextResponse.json(recommendations);
    }
    const tasteProfile = await TasteProfile.findOne({
        userId: session.user.id,
    });
    if (!tasteProfile) {
        return NextResponse.json(
            { error: "Taste profile not found" },
            { status: 404 }
        );
    }
    const shouldRegenerate =
        !recommendation.generatedAt ||
        recommendation.generatedAt < tasteProfile.updatedAt;
    if (shouldRegenerate) {
        const recommendations = await generateRecommendation(session.user.id);
        return NextResponse.json(recommendations);
    }

    return NextResponse.json(recommendation.recommendations);
}