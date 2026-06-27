import ConnectDb from "@/lib/mongodb";
import Anime from "@/models/Anime";
import { getAnime } from "@/lib/jikan";


export default async function getOrCreateAnime(animeId) {
    await ConnectDb();

    const existingAnime = await Anime.findOne({ animeId });

    if (existingAnime) {
        return existingAnime;
    }

    const anime = await getAnime(animeId);

    if (!anime) {
        throw new Error("Anime not found.");
    }
    const title =
        anime.title_english ||
        anime.title ||
        anime.title_japanese;
    const alternateTitles = [
        anime.title,
        anime.title_english,
        anime.title_japanese,
        ...(anime.title_synonyms || []),
    ].filter(Boolean);
    const embeddingText = `
        Title: ${title}

        Synopsis:
        ${anime.synopsis ?? ""}

        Genres:
        ${anime.genres.map(g => g.name).join(", ")}

        Themes:
        ${anime.themes.map(t => t.name).join(", ")}

        Studios:
        ${anime.studios.map(s => s.name).join(", ")}
`;

    const savedAnime = await Anime.create({
        animeId: anime.mal_id,
        title: title,
        alternateTitles: alternateTitles,
        synopsis: anime.synopsis,
        image: anime.images.jpg.image_url,
        genres: anime.genres,
        themes: anime.themes,
        studios: anime.studios,
        episodes: anime.episodes,
        score: anime.score,
        embeddingText: embeddingText,
    });
    return savedAnime;
}