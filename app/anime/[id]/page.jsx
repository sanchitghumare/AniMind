import {getAnime,getRecommendations} from "@/lib/jikan";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WatchlistButton from "@/components/ui/watchlistbutton";
export default async function AnimeDetailsPage({ params }) {
  const { id } =await  params;
  const anime = await getAnime(id);
  const recommendations = await getRecommendations(id);
  return (
    <div className="bg-black text-white min-h-screen">
  <div className="max-w-7xl mx-auto px-6 py-10">

    <div className="grid md:grid-cols-[300px_1fr] gap-10">
     <div>
      <Image
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        width={300}
        height={450}
        className="rounded-xl w-full"
      />
       
       {anime.trailer?.embed_url && (
        
        <iframe
          src={anime.trailer.embed_url}
          width="100%"
          height="500"
          allowFullScreen
          className="rounded-xl mt-6"
        />
      )}
       <WatchlistButton anime={anime} />
      
     </div>
      <div>
        <h1 className="text-5xl font-bold mb-4">
          {anime.title}
        </h1>

        <div className="space-y-2 mb-6">
          <p className="text-xl">⭐ {anime.score}</p>
          <p className="text-xl">📺 {anime.episodes} Episodes</p>
          <p className="text-xl">🎬 {anime.status}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {anime.genres?.map((genre) => (
            <Badge key={genre.mal_id}>
              {genre.name}
            </Badge>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-3">
          Synopsis
        </h2>

        <p className="text-zinc-300 leading-8">
          {anime.synopsis}
        </p>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          <h2 className="text-2xl font-semibold mb-3 col-span-full">
            You may also like:
          </h2>
            {recommendations.slice(0, 4).map((rec) => (
              <Card className="bg-black text-white  hover: scale-105 transition-all hover:bg-zinc-700" key={rec.entry.mal_id}>
                <Link href={`/anime/${rec.entry.mal_id}`} className="w-full">
                <Image
                  src={rec.entry.images.jpg.image_url}
                  alt={rec.entry.title}
                  width={200}
                  height={300}
                 className="rounded-lg w-80 h-80 object-cover"/>
                </Link>
                <CardContent>
                  <p>{rec.entry.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>

    </div>
  </div>
</div>
  );
}