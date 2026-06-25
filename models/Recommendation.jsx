import mongoose from "mongoose";
const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  recommendations: [
    {
      animeId: Number,
      title: String,
      image: String,
      compatibilityScore: Number,          // Match score (0–100)
      reason: String,         // Why it was recommended
    }
  ],

  generatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.Recommendation || mongoose.model("Recommendation", RecommendationSchema);