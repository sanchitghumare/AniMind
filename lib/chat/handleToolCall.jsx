import addToWatchlist from "../tools/addToWatchlist";

export default async function handleToolCall(userId, message) {
  const text = message.toLowerCase();

  if (text.startsWith("add ")) {
    const anime = message
      .replace(/add/i, "")
      .replace(/to my watchlist/i, "")
      .trim();

    return await addToWatchlist(userId, anime);
  }

  return null;
}