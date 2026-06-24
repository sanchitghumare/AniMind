import fetchTasteProfile from "@/lib/generateTasteProfile";
import generateAISummary from "@/lib/generateAISummary";

export async function GET() {
  try {
    const profile = await fetchTasteProfile();
    const aiSummary = await generateAISummary(profile.userId);
    return new Response(JSON.stringify({ profile, aiSummary }), { status: 200 });
  } catch (error) {
    console.error("Error fetching taste profile:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch taste profile" }), { status: 500 });
  }
}
