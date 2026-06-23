import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import Watchlist from "@/models/watchlist";
export async function POST(request) {
    try {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Please sign in to add to watchlist" }, { status: 401 });
    }
    const {animeId, title, image,score, rating, episodes, status} = await request.json();
    await ConnectDb();
    const user= await User.findOne({ email: session.user.email });
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
        status: status || "watchlist",
    });
    return NextResponse.json({ message: "Anime added to watchlist" }, { status: 201 });
    } catch (error) {
    console.error("Error adding anime to watchlist:", error);
    return NextResponse.json({ error: "Failed to add anime to watchlist" }, { status: 500 });
   }
}

