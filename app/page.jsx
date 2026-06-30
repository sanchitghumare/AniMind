
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import { searchAnime } from "@/lib/jikan";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { Search, Sparkles, Bookmark, Star } from "lucide-react";
import {signIn} from "next-auth/react";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    if (query.trim()) {
      router.push(`/anime?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-20 lg:py-24 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
            AniMind
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 mb-8 sm:mb-12 leading-relaxed">
            Discover your next favorite anime with AI-powered personalized recommendations based on your unique taste.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12 sm:mb-16 w-full">
            <Input
              placeholder="Search anime..."
              className="flex-1 h-12 sm:h-14 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold whitespace-nowrap"
              onClick={handleSearch}
            >
              <Search size={18} className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Sparkles className="text-blue-400" size={24} />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">AI Taste Profile</h3>
            <p className="text-zinc-400 text-sm sm:text-base">
              Discover your anime persona. Our AI analyzes your ratings to understand your unique preferences.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Star className="text-blue-400" size={24} />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Smart Recommendations</h3>
            <p className="text-zinc-400 text-sm sm:text-base">
              Get anime recommendations ranked by AI compatibility. Discover shows you'll actually love.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Bookmark className="text-blue-400" size={24} />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Track Your Journey</h3>
            <p className="text-zinc-400 text-sm sm:text-base">
              Maintain your watchlist, rate anime, and track your progress through your favorite shows.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-2xl mx-auto px-4 mb-20">
        <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
            Ready to start exploring?
          </h2>

          <p className="text-zinc-300 mb-8 text-sm sm:text-base leading-relaxed">
            Sign in with GitHub to build your AI anime taste profile and receive recommendations tailored specifically to you.
          </p>


            <Button onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="w-full sm:w-auto px-8 py-3 text-base font-semibold">
              Sign in with GitHub
            </Button>
         
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 py-8 px-4 text-center text-zinc-400 text-sm">
        <p>© 2026 AniMind</p>
      </div>
    </main>
  );
}