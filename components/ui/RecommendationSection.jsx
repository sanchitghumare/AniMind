"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
export default function RecommendationSection() {
    const [recommendations, setRecommendations] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
           if (!session) return;
        async function fetchRecommendations() {
            const res = await fetch("/api/recommendations");
            const data = await res.json();
            if(res.status===429){
                throw new Error("Too many requests. Please wait a minute before trying again.");
            }
            if (!res.ok) {
                setRecommendations([]);
                return;
            }
            setRecommendations(data);
        }

        fetchRecommendations();
    }, [session]);
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="p-10">
                <h2 className="text-xl font-semibold">
                    No recommendations available yet.
                </h2>
                <p className="text-gray-400">
                    Rate a few more anime to get personalized recommendations.
                </p>
            </div>
        );
    }
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold text-blue-500 mb-6">
                🎯 Personalized For You
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-10">

                {recommendations.map((anime) => (
                    <Link href={`/anime/${anime.animeId}`} key={anime.animeId} className="w-full">
                        <Card className="overflow-hidden h-fit w-full bg-zinc-900  border-zinc-800 transition-all hover:scale-105 hover:border-orange-500">
                            <CardContent className="p-0">
                                <Image
                                    src={anime.image}
                                    alt={anime.title}
                                    width={200}
                                    height={200}
                                    // onclick={()=>}
                                    className="rounded-lg w-full h-64 object-cover "
                                />

                                <div className="p-4">
                                    <h2 className="font-semibold text-zinc-400  text-xl line-clamp-2">
                                        {anime.title}
                                    </h2>
                                    <p className="text-green-400 font-semibold">
                                        🎯 {anime.compatibilityScore}% Match
                                    </p>

                                    <p className="text-sm text-zinc-400 mt-2">
                                        <span className="font-semibold text-white">
                                            Why you'll like it:
                                        </span>{" "}
                                        {anime.reason}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
