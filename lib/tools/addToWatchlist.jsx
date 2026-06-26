import ConnectDb from "@/lib/mongodb";
import Watchlist from "@/models/watchlist";
import { searchAnime, getAnime } from "@/lib/jikan";
export default async function addToWatchlist(
    userId,
    animeTitle,
    status = "plan_to_watch"
) {
    await ConnectDb();
    try {
        const searchResults = await searchAnime(animeTitle);

        if (!searchResults || searchResults.length === 0) {
            return {
                success: false,
                message: `I couldn't find any anime titled "${animeTitle}". Please check the title and try again.`,
            };
        }

        const anime = await getAnime(searchResults[0].mal_id);

        if (!anime) {
            return {
                success: false,
                message: `I couldn't retrieve details for "${animeTitle}". Please try again later.`,
            }
        }
        const existingEntry = await Watchlist.findOne({
            userId,
            animeId: anime.mal_id,
        });
        if (existingEntry) {
            return {
                success: false,
                message: `The anime "${animeTitle}" is already in your watchlist.`,
            };
        }
        await Watchlist.create({
            userId,
            animeId: anime.mal_id,
            title: anime.title,
            image: anime.images.jpg.image_url,
            status,
            genres: anime.genres,
            themes: anime.themes,
            episodes: anime.episodes,
            rating: anime.score,
        });
        return {
            success: true,
            action: "add_watchlist",
            anime: anime.title,
            message: `"${anime.title}" has been added to your watchlist.`,
        };
    } catch (error) {
        console.error("addToWatchlist error:", error);

        if (
            error.message.includes("overloaded") ||
            error.message.includes("temporarily unavailable")
        ) {
            return {
                success: false,
                message: error.message,
            };
        }

        if (error.message.includes("unreachable")) {
            return {
                success: false,
                message: "The anime service is currently unreachable. Please try again later.",
            };
        }

        return {
            success: false,
            message: "Something went wrong while adding the anime to your watchlist.",
        };
    }
}