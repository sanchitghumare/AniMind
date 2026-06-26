import { searchAnime } from "@/lib/jikan";

export default async function handleSearch(message) {
    // We'll improve this extraction later
    const query = message
        .replace(/search|find|anime|show me/gi, "")
        .trim();

    if (!query) {
        return "Which anime would you like me to search for?";
    }

    const results = await searchAnime(query);

    if (results.length === 0) {
        return `I couldn't find any anime named "${query}".`;
    }

    const anime = results[0];

    return `${anime.title}

⭐ Score: ${anime.score ?? "N/A"}
📺 Episodes: ${anime.episodes ?? "Unknown"}

Would you like to know more about it?`;
}