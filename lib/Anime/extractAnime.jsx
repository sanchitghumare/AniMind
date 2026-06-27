import Anime from "@/models/Anime";
import ConnectDb from "@/lib/mongodb";

export default async function extractAnime(message) {
    await ConnectDb();

    const anime = await Anime.findOne({
        $or: [
            {
                title: {
                    $regex: message,
                    $options: "i",
                },
            },
            {
                alternateTitles: {
                    $regex: message,
                    $options: "i",
                },
            },
        ],
    });

    return anime;
}