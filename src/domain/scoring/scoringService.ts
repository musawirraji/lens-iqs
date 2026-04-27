/**
 * Orchestrates a single IQS scoring run.
 * Pure domain — does not import Next.js or framework code.
 */
import "server-only";
import { claude } from "@infra/claude/claudeClient";
import { env } from "@lib/env";
import { buildUserPrompt, SYSTEM_PROMPT, PROMPT_VERSION } from "./promptBuilder";
import { iqsResultSchema, type IQSResult } from "./schema";

export interface ScoreInput {
  text: string;
  title?: string;
  source?: string;
}

export interface ScoreOutput {
  result: IQSResult;
  model: string;
  elapsedMs: number;
  promptVersion: string;
}

/**
 * Runs a single IQS scoring pass. Throws if the response cannot be
 * parsed against the schema. Callers (route handlers) decide how to
 * surface the failure to the client.
 */
export async function scoreArticle(input: ScoreInput): Promise<ScoreOutput> {
  const start = Date.now();

  const truncated = input.text.slice(0, env.LENS_MAX_INPUT_CHARS);

  const message = await claude.messages.create({
    model: env.LENS_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt({
          articleText: truncated,
          articleTitle: input.title,
          articleSource: input.source,
        }),
      },
    ],
  });

  // Extract first text block from the message.
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("scoring/no_text_block");
  }

  const raw = stripFences(textBlock.text.trim());

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("scoring/invalid_json");
  }

  const result = iqsResultSchema.parse(parsedJson);

  return {
    result,
    model: env.LENS_MODEL,
    elapsedMs: Date.now() - start,
    promptVersion: PROMPT_VERSION,
  };
}

/** Strip ```json fences if Claude added them despite instructions. */
function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
}
