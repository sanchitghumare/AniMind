import ConnectDb from "@/lib/mongodb";
import Watchlist from "@/models/watchlist";
import findAnimeInWatchlist from "@/lib/findAnimeInWatchlist";
export default async function updateWatchlistStatus(
    userId,
    animeTitle,
    status
) {
    status = status
        .toLowerCase()
        .trim()
        .replaceAll(" ", "_");
    const validStatuses = [
        "watching",
        "completed",
        "plan_to_watch",
        "dropped",
    ];
    if (!validStatuses.includes(status)) {
        return {
            success: false,
            message: `Invalid status. Please choose from: ${validStatuses.join(", ")}`,
        };
    }
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
await Watchlist.findOneAndUpdate({
    userId,
    animeId: anime.animeId,
}, {
    status
});
return {
    success: true,
    action: "update_watchlist",
    anime: anime.title,
    status,
    message: `"${anime.title}" has been updated in your watchlist.`,
};
}