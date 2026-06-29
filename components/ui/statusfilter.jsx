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
      }}
      className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-zinc-600 cursor-pointer"
    >
      <option value="all">All</option>
      <option value="plan_to_watch">Plan to Watch</option>
      <option value="watching">Watching</option>
      <option value="completed">Completed</option>
      <option value="dropped">Dropped</option>
    </select>
  );
}