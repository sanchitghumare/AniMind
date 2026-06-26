import Fuse from "fuse.js";

export default function findAnimeInWatchlist(watchlist, query) {
    const fuse = new Fuse(watchlist, {
        keys: ["title"],
        threshold: 0.35,
    });

    const results = fuse.search(query);

    return results.length ? results[0].item : null;
}