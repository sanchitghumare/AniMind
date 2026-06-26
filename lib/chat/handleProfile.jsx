import TasteProfile from "@/models/TasteProfile";

export default async function handleProfile(userId) {
    const profile = await TasteProfile.findOne({ userId });

    if (!profile) {
        return "I don't know your anime taste yet. Rate a few anime first!";
    }

    return `Based on your ratings:

🎭 Top Genres:
${profile.topGenres.map(g => g.name).join(", ")}

🧠 Top Themes:
${profile.topThemes.map(t => t.name).join(", ")}

Your anime persona is:
${profile.archetype}`;
}