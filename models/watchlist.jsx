
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

  title: String,

  image: String,

  score: Number,

  status: {
    type: String,
    default: "watchlist",
  },

}, { timestamps: true });

export default mongoose.models.Watchlist ||
mongoose.model("Watchlist", WatchlistSchema);