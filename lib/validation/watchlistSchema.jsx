import { z } from "zod";

export const createWatchlistSchema = z.object({
  animeId: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  image: z.string().url(),
  score: z.number().min(0).max(10).nullable().optional(),
  rating: z.number().nullable().optional(),
  episodes: z.number().int().nonnegative().optional(),
  status: z.enum([
    "watching",
    "completed",
    "on_hold",
    "dropped",
    "plan_to_watch",
  ]).optional(),
  userRating: z.number().int().min(1).max(10).nullable().optional(),
});

export const updateWatchlistSchema = z.object({
  animeId: z.number().int().positive(),
  status: z.enum([
    "watching",
    "completed",
    "dropped",
    "plan_to_watch",
  ]).optional(),
  userRating: z.number().int().min(1).max(10).optional(),
});