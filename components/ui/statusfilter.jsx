"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      value={searchParams.get("status") || "all"}
      onChange={(e) => {
        router.push(`/watchlist?status=${e.target.value}`);
      }} className="bg-zinc-800 text-zinc-400 border border-zinc-600 rounded-lg  p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="all">All</option>
      <option value="plan_to_watch">Plan to Watch</option>
      <option value="watching">Watching</option>
      <option value="completed">Completed</option>
      <option value="dropped">Dropped</option>
    </select>
  );
}