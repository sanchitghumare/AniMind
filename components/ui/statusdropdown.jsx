"use client";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
export default function StatusDropdown({ currentStatus,animeId }) {
    const router = useRouter();
    async function updateStatus(e) {
        const newStatus = e.target.value;
        try {
            const response = await fetch("/api/watchlist", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ animeId: animeId, status: newStatus })
            });
            if (!response.ok) {
                throw new Error("Failed to update watchlist");
            }
            toast.success("Watchlist updated successfully");
            router.refresh();
        } catch (error) {
            console.error("Error updating watchlist:", error);
            toast.error("Failed to update watchlist");
        }
    }
    return (
        <select 
          value={currentStatus} 
          onChange={updateStatus} 
          className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-zinc-600 cursor-pointer"
        >
            <option value="plan_to_watch">Plan to Watch</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
        </select>
    );
}