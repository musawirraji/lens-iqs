/**
 * Zod schemas describing the structured JSON we require from Claude.
 * Inferred TypeScript types are exported alongside.
 */
import { z } from "zod";
import { IQS_DIMENSIONS, FLAG_CATEGORIES } from "./dimensions";

const dimensionIds = IQS_DIMENSIONS.map((d) => d.id) as [
  (typeof IQS_DIMENSIONS)[number]["id"],
  ...(typeof IQS_DIMENSIONS)[number]["id"][],
];
const flagIds = FLAG_CATEGORIES.map((f) => f.id) as [
  (typeof FLAG_CATEGORIES)[number]["id"],
  ...(typeof FLAG_CATEGORIES)[number]["id"][],
];

export const dimensionScoreSchema = z.object({
  id: z.enum(dimensionIds),
  score: z.number().min(0).max(10),
  reasoning: z.string().min(1).max(600),
});

export const sentenceFlagSchema = z.object({
  /** The sentence text — must match a substring of the article exactly. */
  sentence: z.string().min(1),
  category: z.enum(flagIds),
  /** Short reason this sentence was flagged (≤ 240 chars). */
  reason: z.string().min(1).max(240),
});

export const iqsResultSchema = z.object({
  aggregate: z.number().min(0).max(100),
  dimensions: z.array(dimensionScoreSchema).length(10),
  flags: z.array(sentenceFlagSchema),
  /** Editorial verdict, 1-3 sentences. Rendered above the dimension table. */
  verdict: z.string().min(1).max(600),
});

export type DimensionScore = z.infer<typeof dimensionScoreSchema>;
export type SentenceFlag = z.infer<typeof sentenceFlagSchema>;
export type IQSResult = z.infer<typeof iqsResultSchema>;

/** Request body sent from the client to /api/score. */
export const scoreRequestSchema = z
  .object({
    url: z.string().url().optional(),
    text: z.string().min(50).optional(),
  })
  .refine((v) => v.url || v.text, {
    message: "Either url or text must be provided.",
  });

export type ScoreRequest = z.infer<typeof scoreRequestSchema>;

/** Response envelope returned from /api/score. */
export const scoreResponseSchema = z.object({
  result: iqsResultSchema,
  article: z.object({
    title: z.string().optional(),
    source: z.string().optional(),
    publishedAt: z.string().optional(),
    wordCount: z.number(),
    text: z.string(),
  }),
  meta: z.object({
    model: z.string(),
    elapsedMs: z.number(),
    runId: z.string(),
  }),
});

export type ScoreResponse = z.infer<typeof scoreResponseSchema>;
