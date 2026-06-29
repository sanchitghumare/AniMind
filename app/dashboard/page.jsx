"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import {searchAnime} from "@/lib/jikan";
import { useRouter } from "next/navigation";
import RecommendationSection from "@/components/ui/RecommendationSection";
import Navbar from "@/components/ui/Navbar";
import { Search } from "lucide-react";

export default function dashboard() {
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Welcome back!
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 mb-8">
              Discover new anime based on your unique taste.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
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
      </div>

      {/* Recommendations Section */}
      <RecommendationSection />
    </main>
  );
}