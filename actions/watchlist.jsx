"use server";
export async function addToWatchlist(animeId, userId) {
    // connect db 
    
  try {
    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animeId, userId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw new Error("Failed to add anime to watchlist");
  }
}
