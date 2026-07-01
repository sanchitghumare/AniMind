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
            if (res.status === 429) {
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
            <div className="px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    No recommendations available yet
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                    Rate a few more anime to get personalized recommendations.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8">
                🎯 Personalized For You
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {recommendations.map((anime) => (
                    <Link href={`/anime/${anime.animeId}`} key={anime.animeId} className="group">
                        <Card className="overflow-hidden h-full card-hover">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="relative aspect-2/3 overflow-hidden bg-zinc-800">
                                    <Image
                                        src={anime.image}
                                        alt={anime.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                                    <h2 className="font-semibold text-white text-sm sm:text-base line-clamp-2 group-hover:text-blue-400 transition-colors">
                                        {anime.title}
                                    </h2>

                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-green-400">
                                            🎯 {anime.compatibilityScore}% Match
                                        </p>

                                        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
                                            <span className="text-zinc-300 font-semibold">Why:</span> {anime.reason}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
