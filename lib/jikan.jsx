export async function searchAnime(query) {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime?q=${query}&limit=10`
  );

  const data = await res.json();
  return data.data;
}
export async function getAnime(id) {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime/${id}`
  );

  const data = await res.json();
  return data.data;
}
export async function getRecommendations(id) {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime/${id}/recommendations`
  );

  const data = await res.json();
  return data.data;
}