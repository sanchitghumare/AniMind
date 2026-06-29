import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import ConnectDb from "@/lib/mongodb";
import Recommendation from "@/models/Recommendation";
import TasteProfile from "@/models/TasteProfile";
import { generateRecommendationsWithLimit } from "@/lib/generaterecommendationlimit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnectDb();

    const tasteProfile = await TasteProfile.findOne({
      userId: session.user.id,
    });

    if (!tasteProfile) {
      return NextResponse.json(
        {
          error: "Taste profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !tasteProfile.topRatedAnime ||
      tasteProfile.topRatedAnime.length < 3
    ) {
      return NextResponse.json([]);
    }

    let recommendation = await Recommendation.findOne({
      userId: session.user.id,
    });

    const shouldRegenerate =
      !recommendation ||
      !recommendation.generatedAt ||
      recommendation.generatedAt < tasteProfile.updatedAt;

    if (shouldRegenerate) {
      console.log("Generating recommendations...");
      try {
        await generateRecommendationsWithLimit(session.user.id);
        recommendation = await Recommendation.findOne({
          userId: session.user.id,
        });
      } catch (error) {
        console.error("Error generating recommendations:", error);
        return NextResponse.json(
          {
            error: error.message || "Failed to generate recommendations",
          },
          {
            status: 429,
          }
        );
      }
    }

    return NextResponse.json(
      recommendation?.recommendations ?? []
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}