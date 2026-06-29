
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
  rating: { type: Number, required: true },
  episodes: { type: Number, required: true },
  status: {
    type: String,
    default: "plan_to_watch",
    enum: ["plan_to_watch", "watching", "completed", "dropped"]
  },
  userRating: {
  type: Number,
  min: 1,
  max: 10,
  default: null,
}

}, { timestamps: true });
WatchlistSchema.index(
  { userId: 1, animeId: 1 },
  { unique: true }
);

// Speed up filtering by status
WatchlistSchema.index({
  userId: 1,
  status: 1,
});

export default mongoose.models.Watchlist ||
mongoose.model("Watchlist", WatchlistSchema);