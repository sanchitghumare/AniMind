"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookmarkMinus } from "lucide-react";
export default function RemoveWatchlistButton({ animeId }) {
    const router = useRouter();
    async function handleRemoveFromWatchlist(animeId,e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch("/api/watchlist", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },body: JSON.stringify({ animeId }),
            });
            const data = await response.json(); 
            if(response.ok) {
                router.refresh();
                toast.success(data.message || "Anime removed from watchlist!");
            } else if(response.status === 404){
                toast.warning(data.error || "Anime not found in watchlist!");
            }
        } catch (error) {
            toast.error("Error removing from watchlist:", error);
        }
    } 
    return (
        <button 
            className="bg-black text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition-all" 
            onClick={(e) => handleRemoveFromWatchlist(animeId, e)}
           
        >
            <BookmarkMinus className="text-white" size={16} />
             
        </button>
    );
}