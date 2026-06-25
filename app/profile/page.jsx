"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ConnectDb from "@/lib/mongodb";
import User from "@/models/user";
import Image from "next/image";
import EditProfile from "@/components/ui/EditProfile";
import Watchlist from "@/models/watchlist";
import TasteProfile from "@/models/TasteProfile";
import { Badge } from "@/components/ui/badge";
export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl font-bold mb-4">You are not logged in</h1>
                <p className="text-lg">Please log in to view your profile.</p>
            </div>
        );
    }
    await ConnectDb();
    const user = await User.findOne({ email: session.user.email });
    const userData = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        image: user.profilepic,
    };
    const len = await Watchlist.countDocuments({ userId: user._id });
    const recentlyAdded = await Watchlist.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
    const tasteProfile = await TasteProfile.findOne({ userId: user._id }).sort({ updatedAt: -1 }).limit(3);
    return (
        <div className="min-h-screen bg-black text-white px-10 py-8">
            <div className="grid lg:grid-cols-[350px_1fr] gap-8">

                {/* LEFT PANEL */}
                <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center">
                    <Image
                        src={userData.image || "/default-profile.png"}
                        alt="Profile Picture"
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-gray-700"
                    />

                    <h1 className="text-2xl font-bold mt-4">
                        {userData.username}
                    </h1>

                    <p className="text-gray-400 mb-6">
                        {userData.email}
                    </p>

                    <div className="w-full">
                        <EditProfile userData={userData} />
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="space-y-6">

                    {/* Watchlist Stats */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            📚 Watchlist Stats
                        </h2>

                        <p className="mb-4">
                            Saved Anime:
                            <span className="font-bold text-blue-400">
                                {" "}
                                {len}
                            </span>
                        </p>

                        <h3 className="font-semibold mb-2">
                            Recently Added
                        </h3>

                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                            {recentlyAdded.map((anime) => (
                                <li key={anime._id.toString()}>
                                    {anime.title}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* AI Persona */}
                    <div className="bg-gradient-to-r from-indigo-900 to-gray-900 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-2">
                            🎭 Your Anime Persona
                        </h2>

                        <h3 className="text-xl text-indigo-300 font-semibold mb-4">
                            {tasteProfile.archetype}
                        </h3>

                        <p className="text-gray-300 leading-7 mb-6">
                            {tasteProfile.aiSummary}
                        </p>

                        <h3 className="font-semibold mb-3">
                            Explore Next
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {tasteProfile.recommendationDirections.map((item) => (
                                <Badge key={item} variant="secondary">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Taste Profile */}
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-6">
                            📊 Taste Profile
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Genres */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Top Genres
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {tasteProfile.topGenres.map((genre) => (
                                        <Badge key={genre.name}>
                                            {genre.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Themes */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Top Themes
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {tasteProfile.topThemes.map((theme) => (
                                        <Badge key={theme.name}>
                                            {theme.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Favorite Anime */}
                            <div>
                                <h3 className="font-semibold mb-3">
                                    Favorite Anime
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {tasteProfile.topRatedAnime.map((anime) => (
                                        <Badge
                                            key={anime.animeId}
                                            variant="secondary"
                                        >
                                            {anime.title} ⭐ {anime.userRating}/10
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}












