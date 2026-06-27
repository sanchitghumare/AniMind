import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    memory: {
      type: String,
      required: true,
    },

    embeddingText: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "preference",
        "dislike",
        "favorite",
        "goal",
        "fact",
        "personal",
      ],
      default: "fact",
    },

    importance: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Memory ||
  mongoose.model("Memory", memorySchema);