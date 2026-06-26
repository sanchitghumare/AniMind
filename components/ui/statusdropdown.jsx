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
        <select value={currentStatus} onChange={updateStatus} className="bg-zinc-800 text-zinc-400 border border-zinc-600 rounded-lg  p-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="plan_to_watch">Plan to Watch</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
        </select>
    );
}