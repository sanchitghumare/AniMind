"use client";
import {toast} from "sonner";
export default function WatchlistButton({ anime }) {
    async function handleAddToWatchlist() {
        try {
            const response = await fetch("/api/watchlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    animeId: anime.mal_id,
                    title: anime.title,
                    image: anime.images.jpg.large_image_url,
                    score: anime.score,
                    rating: anime.score,
                    episodes: anime.episodes,
                    status: "plan_to_watch",
                }),
            });
            const data = await response.json();
            if(response.ok) {
                toast.success(data.message || "Anime added to watchlist!");
            }else if(response.status === 400){
                toast.warning(data.message || "Anime already in watchlist!");
            }
            if(response.status === 401){
                toast.error(data.error || "Please sign in ");
            }
        } catch (error) {
            toast.error("Error adding to watchlist:", error);
        }
    }
    
    return (
        <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition-all" 
            onClick={handleAddToWatchlist}
        >
            + Add to Watchlist
        </button>
        
    );
}