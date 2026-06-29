import ConnectDb from "@/lib/mongodb";
import Anime from "@/models/Anime";
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export default async function findAnime(query) {
  await ConnectDb();

  const escaped = escapeRegex(query);

  let anime = await Anime.findOne({
    title: {
      $regex: `^${escaped}$`,
      $options: "i",
    },
  });

  if (anime) return anime;

  anime = await Anime.findOne({
    alternateTitles: {
      $regex: `^${escaped}$`,
      $options: "i",
    },
  });

  return anime; // null if not found
}