import ConnectDb from "@/lib/mongodb";
import Watchlist from "@/models/watchlist";
import { searchAnime, getAnime } from "@/lib/jikan";
import findAnime from "@/lib/Anime/findAnime";
import Anime from "@/models/Anime";

export default async function addToWatchlist(
  userId,
  animeTitle,
  status = "plan_to_watch"
) {
  await ConnectDb();

  try {
    let anime = await findAnime(animeTitle);

    // Not in our database -> fetch from Jikan
    if (!anime) {
      const searchResults = await searchAnime(animeTitle);

      if (!searchResults || searchResults.length === 0) {
        return {
          success: false,
          message: `I couldn't find any anime titled "${animeTitle}". Please check the title and try again.`,
        };
      }

      anime = await getAnime(searchResults[0].mal_id);
      const embeddingText = `
        Title: ${anime.title}
        Synopsis: ${anime.synopsis ?? ""}
        Genres: ${anime.genres.map(g => g.name).join(", ")}
        Themes: ${anime.themes.map(t => t.name).join(", ")}
        Studios: ${anime.studios.map(s => s.name).join(", ")}
        `;
      await Anime.create({
        animeId: anime.mal_id,
        title: anime.title,
        alternateTitles: anime.title_synonyms,
        synopsis: anime.synopsis,
        image: anime.images.jpg.large_image_url,
        genres: anime.genres,
        themes: anime.themes,
        studios: anime.studios,
        score: anime.score,
        episodes: anime.episodes,
        embeddingText,
      });
      if (!anime) {
        return {
          success: false,
          message: `I couldn't retrieve details for "${animeTitle}". Please try again later.`,
        };
      }
    }

    const animeId = anime.animeId ?? anime.mal_id;

    const existingEntry = await Watchlist.findOne({
      userId,
      animeId,
    });

    if (existingEntry) {
      return {
        success: false,
        message: `"${anime.title}" is already in your watchlist.`,
      };
    }

    await Watchlist.create({
      userId,
      animeId,
      title: anime.title,
      image: anime.image ?? anime.images?.jpg?.image_url,
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
        message:
          "The anime service is currently unreachable. Please try again later.",
      };
    }

    return {
      success: false,
      message:
        "Something went wrong while adding the anime to your watchlist.",
    };
  }
}