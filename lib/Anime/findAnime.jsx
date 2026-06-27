import ConnectDb from "@/lib/mongodb";
import Anime from "@/models/Anime";

export default async function findAnime(query) {
  await ConnectDb();

  const anime = await Anime.findOne({
    $or: [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        alternateTitles: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  });

  return anime;
}