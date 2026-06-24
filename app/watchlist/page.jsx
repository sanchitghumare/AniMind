import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import Watchlist from "@/models/watchlist";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RemoveWatchlistButton from "@/components/ui/removewatchlist";
import StatusDropdown from "@/components/ui/statusdropdown";
import StatusFilter from "@/components/ui/statusfilter";
import RatingDropdown from "@/components/RatingDropdown";
export default async function WatchlistPage({searchParams}) {
    const params= await searchParams;
    const status=params?.status || "all";
   
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
                <p className="text-gray-600">Please log in to view your watchlist.</p>
            </div>
        );
    }
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
         const query = { userId: user._id };
        if (status !== "all") {
        query.status = status;
        }
    const watchlist = await Watchlist.find(query);
    if (watchlist.length === 0) {
    return (
        <div className="min-h-screen bg-black text-white p-10">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
            My Watchlist (0)
            </h1>

            <StatusFilter currentStatus={status} />
        </div>

        <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-bold">
            {status === "all"
                ? "Your watchlist is empty"
                : `No anime marked as ${status}`}
            </h2>

            <p className="text-gray-400 mt-2">
            {status === "all"
                ? "Start exploring anime and save your favorites."
                : "Try another filter or update an anime status."}
            </p>

            {status === "all" && (
            <Link href="/">
                <Button className="mt-4">
                Explore Anime
                </Button>
            </Link>
            )}
        </div>
        </div>
    );
    }
    const len = watchlist.length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-10 bg-black text-white min-h-screen">
            <div>
            <h1 className="text-2xl font-bold mb-4">My Watchlist: ({len})</h1>
            <StatusFilter currentStatus={status} />
            </div>
            {watchlist.map((anime) => (
                
                    <Card className="overflow-hidden h-fit w-full bg-zinc-900  border-zinc-800 transition-all hover:scale-105 hover:border-orange-500" key={anime._id}>
                        <CardContent className="p-0">
                             <Link href={`/anime/${anime.animeId}`} key={anime._id} className="w-full">
                            <Image
                                src={anime.image}
                                alt={anime.title}
                                width={200}
                                height={200}
                                // onclick={()=>}
                                className="rounded-lg w-full h-64 object-cover "
                            />
                               </Link>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold text-zinc-400  text-xl line-clamp-2">
                                        {anime.title}
                                    </h2>
                                    <RemoveWatchlistButton animeId={anime.animeId} />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                <div className="flex flex-col items-start">
                                <p className="text-sm text-zinc-400 ">
                                    ⭐ {anime.rating ?? "N/A"} 
                                </p>
                                <p className="text-sm text-zinc-400 ">
                                    <RatingDropdown animeId={anime.animeId} currentRating={anime.userRating} /> 
                                </p>
                                </div>
                                 <StatusDropdown currentStatus={anime.status} animeId={anime.animeId} />
                              </div>
                                <p className="text-sm text-zinc-400 ">
                                    {anime.episodes ?? "?"} episodes
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                
            ))}
        </div>
    );
}

