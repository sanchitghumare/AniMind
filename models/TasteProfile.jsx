import mongoose from "mongoose";
const TasteProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  topGenres: [
    {
      name: String,
      score: Number,
    },
  ],

  topThemes: [
    {
      name: String,
      score: Number,
    },
  ],
     topRatedAnime: [
    {
      animeId: Number,
      title: String,
      userRating: Number,
    }
  ],

  archetype: String,
  aiSummary: String,
  recommendationDirections: [String],
  lastGenerated: Date,
},{timestamps: true,});
export default mongoose.models.TasteProfile || mongoose.model("TasteProfile", TasteProfileSchema);