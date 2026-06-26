import ConnectDb from "@/lib/mongodb";
import Watchlist from "@/models/watchlist";
import findAnimeInWatchlist from "@/lib/findAnimeInWatchlist";

export default async function rateAnime(userId, animeTitle, rating) {
  await ConnectDb();

  if (rating < 1 || rating > 10) {
    return {
      success: false,
      message: "Rating must be between 1 and 10.",
    };
  }

  const watchlist = await Watchlist.find({ userId });
  const anime = findAnimeInWatchlist(watchlist, animeTitle);
  if (!anime) {
    return {
      success: false,
      message: `The anime "${animeTitle}" is not in your watchlist.`,
    };
  }
  anime.userRating = rating;
  await anime.save();

  return {
    success: true,
    action: "rate_anime",
    anime: anime.title,
    rating,
    message: `You rated "${anime.title}" ${rating}/10.`,
  };
}