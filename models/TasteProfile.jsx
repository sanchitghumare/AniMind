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

  aiSummary: String,

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.TasteProfile || mongoose.model("TasteProfile", TasteProfileSchema);