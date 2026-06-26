import { searchAnime } from "@/lib/jikan";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export default async function AnimePage({ searchParams }) {
    const { query } = await searchParams;
    // console.log("Query:", query);
    const results = await searchAnime(query);
    const session = await getServerSession(authOptions);

    return (
        <main className="bg-black text-white min-h-screen w-full px-6 py-1">
            {/* <h1 className="text-3xl font-bold text-blue-500 py-5 text-center">AniMind</h1> */}
            <div className="flex flex-row items-center justify-center gap-4">
                <form
                    action="/anime"
                    className="flex flex-row items-center justify-center gap-4"
                >
                    <Input
                        name="query"
                        placeholder="Enter your favorite anime"
                        className="w-full my-7 py-5 px-10"
                    />

                    <Button
                        type="submit"
                        className="bg-blue-500 text-white px-5 py-5 rounded-2xl hover:bg-blue-600"
                    >
                        Search
                    </Button>
                </form>
            </div>
            <p className="text-2xl items-center text-center justify-center font-bold mb-8">
                Search Results: {results.length} for {query}
            </p>
            {results.length === 0 && (
                <div className="flex flex-col items-center justify-center align-center py-24 text-center">
                    <h2 className="text-3xl font-bold">No anime found</h2>

                    <p className="mt-3 text-zinc-400">
                        Try another title or check your spelling.
                    </p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-10">
                {results.map((anime) => (
                    <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} className="w-full">
                        <Card className="overflow-hidden h-fit w-full bg-zinc-900  border-zinc-800 transition-all hover:scale-105 hover:border-orange-500" key={anime.mal_id}>
                            <CardContent className="p-0">
                                <Image
                                    src={anime.images.jpg.image_url}
                                    alt={anime.title_english || anime.title}
                                    width={200}
                                    height={200}
                                    // onclick={()=>}
                                    className="rounded-lg w-full h-64 object-cover "
                                />

                                <div className="p-4">
                                    <h2 className="font-semibold text-zinc-400  text-xl line-clamp-2">
                                        {anime.title_english || anime.title}
                                    </h2>

                                    <p className="text-sm text-zinc-400 ">
                                        ⭐ {anime.score ?? "N/A"}
                                    </p>

                                    <p className="text-sm text-zinc-400 ">
                                        {anime.episodes ?? "?"} episodes
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

            </div>

        </main>
    );
}
