import Recommendation from "@/models/Recommendation";

export default async function handleRecommendation(userId, message) {
  const recommendationDoc = await Recommendation.findOne({ userId });

  if (
    !recommendationDoc ||
    recommendationDoc.recommendations.length === 0
  ) {
    return "I don't have personalized recommendations for you yet. Rate a few anime first!";
  }

  const recommendations = recommendationDoc.recommendations.slice(0, 10);

  const prompt = `
You are AniMind, a personalized anime recommendation assistant.

The following anime have already been selected by AniMind's recommendation engine for this user.

=========================
PERSONALIZED RECOMMENDATIONS
=========================

${recommendations
  .map(
    (anime) => `
Title: ${anime.title}
Compatibility: ${anime.compatibilityScore}%
Reason: ${anime.reason}
`
  )
  .join("\n")}

=========================
USER REQUEST
=========================

${message}

=========================
RULES
=========================

- Recommend ONLY anime from the personalized recommendation list.
- Never invent anime.
- Never recommend anime outside this list.
- Choose the best 2-3 anime that satisfy the user's request.
- Explain why each recommendation matches the request.
- If none of the recommendations fit well, say so honestly.
- Keep the response under 150 words.
- Respond naturally like a helpful assistant.

Return only the assistant response.
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate recommendation response.");
  }

  const data = await response.json();

  return data.response.trim();
}