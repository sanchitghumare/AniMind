
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import { searchAnime } from "@/lib/jikan";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const router = useRouter();
  const handleSearch = async () => {
    const results = await searchAnime(query);
    setResults(results);
    router.push(`/anime?query=${query}`)
  };
  return (

    <main className="bg-black text-white min-h-screen">

      <div className="flex flex-col items-center justify-center  py-2">
        {<h1 className="text-3xl font-bold text-blue-500 py-5">AniMind</h1>
        }

        <p className="text-lg text-center">
          Get personalized anime recommendations based on your preferences.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Input placeholder="Enter your favorite anime" className="w-1/2 my-7 py-5 px-10" onChange={(e) => setQuery(e.target.value)} />
        <Button className="bg-blue-500 text-white px-5 py-5 rounded-2xl hover:bg-blue-600" onClick={handleSearch}>
          Search
        </Button>

      </div>
      <div className="mt-12 flex justify-center">
        <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">

          <h2 className="text-3xl font-bold mb-4">
            🎯 Unlock Personalized Recommendations
          </h2>

          <p className="text-zinc-400 mb-6">
            Sign in with GitHub to build your AI anime taste profile, rate your
            favorite shows, and receive recommendations tailored specifically to you.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl mb-2">🎭</p>
              <h3 className="font-semibold">AI Taste Profile</h3>
              <p className="text-zinc-400 mt-2">
                Discover your anime persona.
              </p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl mb-2">⭐</p>
              <h3 className="font-semibold">Smart Recommendations</h3>
              <p className="text-zinc-400 mt-2">
                Recommendations ranked by AI.
              </p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-2xl mb-2">📚</p>
              <h3 className="font-semibold">Track Your Journey</h3>
              <p className="text-zinc-400 mt-2">
                Watchlist, ratings and progress.
              </p>
            </div>
          </div>

          <Link href="/api/auth/signin">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
              Sign in with GitHub
            </Button>
          </Link>

        </div>
      </div>
    </main>

  );
}