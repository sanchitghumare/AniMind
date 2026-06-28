import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Watchlist from "@/models/watchlist";
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Please sign in to add to watchlist" }, { status: 401 });
        }
        const { animeId, title, image, score, rating, episodes, status, userRating } = await request.json();
        await ConnectDb();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const existing = await Watchlist.findOne({ userId: user._id, animeId });
        if (existing) {
            return NextResponse.json({ message: "Anime already in watchlist" }, { status: 400 });
        }
        await Watchlist.create({
            userId: user._id,
            animeId,
            title,
            image,
            score,
            rating,
            episodes,
            status: status || "plan_to_watch",
            userRating: userRating || null
        });
        return NextResponse.json({ message: "Anime added to watchlist" }, { status: 201 });
    } catch (error) {
        console.error("Error adding anime to watchlist:", error);
        return NextResponse.json({ error: "Failed to add anime to watchlist" }, { status: 500 });
    }
}
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Please sign in to remove from watchlist" }, { status: 401 });
        }
        const { animeId } = await request.json();
        await ConnectDb();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const existing = await Watchlist.findOne({ userId: user._id, animeId });
        if (!existing) {
            return NextResponse.json({ error: "Anime not found in watchlist" }, { status: 404 });
        }
        await Watchlist.deleteOne({ userId: user._id, animeId });
        return NextResponse.json({ message: "Anime removed from watchlist" }, { status: 200 });
    } catch (error) {
        console.error("Error removing anime from watchlist:", error);
        return NextResponse.json({ error: "Failed to remove anime from watchlist" }, { status: 500 });
    }
}
export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Please sign in to update watchlist" }, { status: 401 });
        }
        const { animeId, status, userRating } = await request.json();
        await ConnectDb();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const existing = await Watchlist.findOne({ userId: user._id, animeId });
        if (!existing) {
            return NextResponse.json({ error: "Anime not found in watchlist" }, { status: 404 });
        }
        if (status !== undefined) {
            existing.status = status;
        }

        if (userRating !== undefined) {
            existing.userRating = userRating;
        }
        await existing.save();
        return NextResponse.json({ message: "Watchlist updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating watchlist:", error);
        return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
    }
}