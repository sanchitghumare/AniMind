export async function searchAnime(query) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(
        `Jikan Error (${res.status}):`,
        data.message || "Unknown error"
      );
      if(res.status === 429) {
        return `The anime service is currently overloaded. Please try again later.`;
      }
      if(res.status === 503) {
        return `The anime service is temporarily unavailable. Please try again later.`;
      }
      return [];
    }
    return data.data ?? [];
  } catch (err) {
    console.error("Failed to reach Jikan:", err);
    return [];
  }
}
export async function getAnime(id) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${id}`
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(
        `Jikan Error (${res.status}):`,
        data.message || "Unknown error"
      );
      if(res.status === 429) {
        return `The anime service is currently overloaded. Please try again later.`;
      }
      if(res.status === 503) {
        return `The anime service is temporarily unavailable. Please try again later.`;
      }
      return null;
    }
    return data.data;
  } catch (err) {
    console.error("Failed to reach Jikan:", err);
    return null;
  }
}
export async function getRecommendations(id) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${id}/recommendations`
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(
        `Jikan Error (${res.status}):`,
        data.message || "Unknown error"
      );
      if(res.status === 429) {
        return `The anime service is currently overloaded. Please try again later.`;
      }
      if(res.status === 503) {
        return `The anime service is temporarily unavailable. Please try again later.`;
      }if(res.status === 504) {
        return `The anime service is currently unreachable. Please try again later.`;
      }
      return [];
    }
    return data.data;
  } catch (err) {
    console.error("Failed to reach Jikan:", err);
    return [];
  }
}