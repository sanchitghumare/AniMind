
import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  animeId: {
    type: Number,
    required: true,
  },

  title: { type: String, required: true },

  image: { type: String, required: true },
  score: { type: Number, required: true },
  rating: { type: Number, required: true },
  episodes: { type: Number, required: true },
  status: {
    type: String,
    default: "watchlist",
  },

}, { timestamps: true });

export default mongoose.models.Watchlist ||
mongoose.model("Watchlist", WatchlistSchema);