"use client"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import {searchAnime} from "@/lib/jikan";
import { useRouter } from "next/navigation";
export default function dashboard() {
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
        <h1 className="text-3xl font-bold text-blue-500 py-5">AniMind</h1>
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
    </main>
  );
}
