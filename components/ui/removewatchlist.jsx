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
            className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
            onClick={(e) => handleRemoveFromWatchlist(animeId, e)}
            title="Remove from watchlist"
        >
            <BookmarkMinus size={16} />
        </button>
    );
}