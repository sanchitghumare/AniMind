"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RatingDropdown({
  animeId,
  currentRating,
}) {
  const router = useRouter();

  async function updateRating(e) {
    const rating = Number(e.target.value);

    try {
      const response = await fetch("/api/watchlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeId,
          userRating: rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }

      toast.success("Rating updated");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update rating");
    }
  }

  return (
    <select
      value={currentRating || ""}
      onChange={updateRating}
      className="bg-zinc-800 text-zinc-400 border border-zinc-600 rounded p-1"
    > 
     
      <option value="">Rate</option>

      {[...Array(10)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}/10
        </option>
      ))}
    </select>
    
  );
}