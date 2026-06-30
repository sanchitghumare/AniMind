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
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen px-4">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">You are not logged in</h1>
                    <p className="text-zinc-400 mb-6">Please log in to view your profile.</p>
                    <Link href="/api/auth/signin">
                        <Button>Sign in</Button>
                    </Link>
                </div>
            </div>
        );
    }

    await ConnectDb();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen px-4">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">User not found</h1>
                    <p className="text-zinc-400">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    const userData = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        image: user.profilepic,
    };

    const len = await Watchlist.countDocuments({ userId: user._id });
    const recentlyAdded = await Watchlist.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
    const tasteProfile = await TasteProfile.findOne({ userId: user._id }).sort({ updatedAt: -1 }).limit(3);

    if (!tasteProfile) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">Taste Profile not found</h1>
                    <p className="text-zinc-400 mb-6">Rate some anime to generate your taste profile.</p>
                    <Link href="/watchlist">
                        <Button>Go to Watchlist</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 sm:gap-8">

                    {/* LEFT PANEL - Profile Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 h-fit">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border mb-4 border-blue-800/50">
                                <img
                                    src={userData.image || "/default-profile.png"}
                                    alt="Profile Picture"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold mb-1">
                                {userData.username}
                            </h1>

                            <p className="text-zinc-400 text-sm mb-6 break-all">
                                {userData.email}
                            </p>

                            <div className="w-full">
                                <EditProfile userData={userData} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - Stats and Profile */}
                    <div className="space-y-6 sm:space-y-8">

                        {/* Watchlist Stats */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6">
                                📚 Watchlist Stats
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                <div className="bg-zinc-800 rounded-lg p-4">
                                    <p className="text-zinc-400 text-sm mb-1">Total Saved</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-400">{len}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">
                                    Recently Added
                                </h3>

                                <ul className="space-y-2">
                                    {recentlyAdded.map((anime) => (
                                        <li key={anime._id.toString()} className="text-zinc-300 text-sm truncate">
                                            • {anime.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* AI Persona */}
                        <div className="bg-linear-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3">
                                🎭 Your Anime Persona
                            </h2>

                            <h3 className="text-lg sm:text-xl text-blue-300 font-semibold mb-4">
                                {tasteProfile.archetype}
                            </h3>

                            <p className="text-zinc-300 leading-relaxed mb-6 text-sm sm:text-base">
                                {tasteProfile.aiSummary}
                            </p>

                            <div>
                                <h3 className="font-semibold mb-3 text-white text-sm sm:text-base">
                                    Explore Next
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {tasteProfile.recommendationDirections.map((item) => (
                                        <Badge key={item} className="bg-blue-600/20 text-blue-300 border border-blue-500/30">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Taste Profile */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6">
                                📊 Taste Profile
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Genres */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm sm:text-base">
                                        Top Genres
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {tasteProfile.topGenres.map((genre) => (
                                            <Badge key={genre.name} className="bg-zinc-800 text-white border border-zinc-700">
                                                {genre.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Themes */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm sm:text-base">
                                        Top Themes
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {tasteProfile.topThemes.map((theme) => (
                                            <Badge key={theme.name} className="bg-zinc-800 text-white border border-zinc-700">
                                                {theme.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Favorite Anime */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm sm:text-base">
                                        Favorite Anime
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {tasteProfile.topRatedAnime.map((anime) => (
                                            <Badge
                                                key={anime.animeId}
                                                className="bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs"
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
        </div>
    );
}












