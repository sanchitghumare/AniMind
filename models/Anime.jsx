import mongoose from "mongoose";

const animeSchema = new mongoose.Schema(
  {
    animeId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },
    alternateTitles: {
      type: [String],
      default: [],
    },
    synopsis: {
      type: String,
      default: "",
    },

    image: String,

    genres: [
      {
        mal_id: Number,
        name: String,
      },
    ],

    themes: [
      {
        mal_id: Number,
        name: String,
      },
    ],

    studios: [
      {
        mal_id: Number,
        name: String,
      },
    ],

    score: Number,

    episodes: Number,

    // Text Atlas will embed
    embeddingText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
animeSchema.index({ animeId: 1 }, { unique: true });

export default mongoose.models.Anime ||
  mongoose.model("Anime", animeSchema);