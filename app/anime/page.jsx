import { searchAnime } from "@/lib/jikan";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/ui/Navbar";
import { Search } from "lucide-react";

export default async function AnimePage({ searchParams }) {
    const { query } = await searchParams;
    const results = await searchAnime(query);
    const session = await getServerSession(authOptions);

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Search Bar */}
                <form action="/anime" className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            name="query"
                            placeholder="Search anime..."
                            defaultValue={query}
                            className="flex-1 h-12 sm:h-14 text-base"
                        />

                        <Button
                            type="submit"
                            className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold whitespace-nowrap"
                        >
                            <Search size={18} className="mr-2" />
                            Search
                        </Button>
                    </div>
                </form>

                {/* Results Header */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Search Results
                    </h2>
                    <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                        {results.length} result{results.length !== 1 ? 's' : ''} found for "<span className="text-white font-semibold">{query}</span>"
                    </p>
                </div>

                {/* No Results State */}
                {results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3">No anime found</h2>
                        <p className="text-zinc-400 text-base sm:text-lg">
                            Try another title or check your spelling.
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {results.map((anime) => (
                        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="group">
                            <Card className="overflow-hidden h-full card-hover">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative aspect-2/3 overflow-hidden bg-zinc-800">
                                        <Image
                                            src={anime.images.jpg.image_url}
                                            alt={anime.title_english || anime.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                                        <h2 className="font-semibold text-white text-sm sm:text-base line-clamp-2 group-hover:text-blue-400 transition-colors">
                                            {anime.title_english || anime.title}
                                        </h2>

                                        <div className="space-y-1 text-xs sm:text-sm text-zinc-400">
                                            <p>
                                                ⭐ <span className="text-blue-400 font-semibold">{anime.score ?? "N/A"}</span>
                                            </p>

                                            <p>
                                                📺 {anime.episodes ?? "?"} episodes
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
