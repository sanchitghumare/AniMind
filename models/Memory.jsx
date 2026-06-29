import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    memory: {
      type: String,
      required: true,
      trim: true,
    },

    embeddingText: {
      type: String,
      required: true,
      trim: true,
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
      min: 1,
      max: 10,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
memorySchema.index(
  { userId: 1, subject: 1 },
  { unique: true }
);

export default mongoose.models.Memory ||
  mongoose.model("Memory", memorySchema);