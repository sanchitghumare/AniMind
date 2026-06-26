import ConnectDb from "./mongodb";
import TasteProfile from "@/models/TasteProfile";
import {getAnime} from "./jikan";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Watchlist from "@/models/watchlist";
export default async function fetchTasteProfile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("User not authenticated");
    }
    await ConnectDb();
    const entries = await Watchlist.find({
        userId: session.user.id,
        userRating: { $ne: null }
    }).select("animeId title userRating");
    const genreScores={};
    const themesScores={};
    for(const entry of entries){
        const weight=entry.userRating;
        const details=await getAnime(entry.animeId);
        // console.log("Details for animeId", entry.animeId, ":", details);
        details.genres.forEach((genre)=>{
            if(genreScores[genre.name]){
                genreScores[genre.name]+=weight;
            }else{
                genreScores[genre.name]=weight;
            }
        });
        details.themes.forEach((theme)=>{
            if(themesScores[theme.name]){
                themesScores[theme.name]+=weight;
            }else{
                themesScores[theme.name]=weight;
            }
        });
    }
    const topRatedAnime = await Watchlist.find({
      userId: session.user.id,
      userRating: { $ne: null }
    })
    .sort({ userRating: -1 })
    .limit(5)
    .select("animeId title userRating");
    const topGenres = Object.entries(genreScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, score]) => ({ name, score }));
     const topThemes = Object.entries(themesScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, score]) => ({ name, score }));
    await TasteProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        topGenres,
        topThemes,
        topRatedAnime,
      },
      { upsert: true, returnDocument: "after",}
    );
     
    return {
    userId: session.user.id,  
    topGenres,
    topThemes,
    topRatedAnime
    };
  
  } catch (error) {
    console.error("Error fetching taste profile:", error);
    throw new Error("Failed to fetch taste profile");
  }
}

