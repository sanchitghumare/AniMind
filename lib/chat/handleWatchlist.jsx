import Watchlist from "@/models/watchlist";

export default async function handleWatchlist(userId, message) {
  const watchlist = await Watchlist.find({ userId });

  if (watchlist.length === 0) {
    return "Your watchlist is empty. Start adding anime to receive personalized recommendations!";
  }

  const completed = watchlist.filter(
    (anime) => anime.status === "completed"
  ).length;

  const watching = watchlist.filter(
    (anime) => anime.status === "watching"
  ).length;

  const planned = watchlist.filter(
    (anime) => anime.status === "plan_to_watch"
  ).length;

  return `You have ${watchlist.length} anime in your watchlist.

• Completed: ${completed}
• Watching: ${watching}
• Plan to Watch: ${planned}`;
}