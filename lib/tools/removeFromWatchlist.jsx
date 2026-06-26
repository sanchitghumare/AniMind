import ConnectDb from "@/lib/mongodb";
import Watchlist from "@/models/watchlist";
import findAnimeInWatchlist from "@/lib/findAnimeInWatchlist";
export default async function removeFromWatchlist(userId, animeTitle) {
    await ConnectDb();
    const watchlist = await Watchlist.find({ userId });

    if (!watchlist.length) {
        return {
            success: false,
            message: `No anime found in your watchlist with the title "${animeTitle}".`,
        };
    }

    const anime = findAnimeInWatchlist(watchlist, animeTitle);
    if (!anime) {
        return {
            success: false,
            message: `The anime "${animeTitle}" is not in your watchlist.`,
        };
    }
    await Watchlist.deleteOne({
        userId,
        animeId: anime.animeId,
    });
    return {
        success: true,
        action: "remove_watchlist",
        anime: anime.title,
        message: `"${anime.title}" has been removed from your watchlist.`,
    };
}
