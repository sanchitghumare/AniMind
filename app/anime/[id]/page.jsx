import {getAnime,getRecommendations} from "@/lib/jikan";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import BackButton from "@/components/Backbutton";
import WatchlistButton from "@/components/ui/watchlistbutton";
import Navbar from "@/components/ui/Navbar";

export default async function AnimeDetailsPage({ params }) {
  const { id } =await  params;
  const anime = await getAnime(id);
  const recommendations = await getRecommendations(id);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 shadow-lg">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title_english || anime.title}
                width={320}
                height={480}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {anime.trailer?.embed_url && (
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 shadow-lg">
                <iframe
                  src={anime.trailer.embed_url}
                  width="100%"
                  height="315"
                  allowFullScreen
                  className="w-full"
                  title="Anime Trailer"
                />
              </div>
            )}
            
            <WatchlistButton anime={anime} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 line-clamp-3">
                {anime.title_english || anime.title}
              </h1>
              <BackButton />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm">Rating</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-400">⭐ {anime.score}</p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm">Episodes</p>
                  <p className="text-xl sm:text-2xl font-bold">{anime.episodes || "?"}</p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-zinc-400 text-sm">Status</p>
                  <p className="text-sm sm:text-base font-bold truncate">{anime.status}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.genres?.map((genre) => (
                  <Badge key={genre.mal_id} className="bg-blue-600/20 text-blue-300 border border-blue-500/30">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
                {anime.synopsis}
              </p>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  You might also like
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendations.slice(0, 8).map((rec) => (
                    <Link href={`/anime/${rec.entry.mal_id}`} key={rec.entry.mal_id} className="group">
                      <Card className="overflow-hidden h-full card-hover">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden bg-zinc-800">
                            <Image
                              src={rec.entry.images.jpg.image_url}
                              alt={rec.entry.title}
                              width={200}
                              height={300}
                              className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="p-3 sm:p-4">
                            <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {rec.entry.title}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}