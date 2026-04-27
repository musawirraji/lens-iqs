/**
 * Client-side use-case for running an IQS analysis. Calls the Edge function,
 * validates the response, returns a typed result. UI components import only
 * this — never `fetch` directly.
 */
import { scoreResponseSchema, type ScoreResponse } from "@domain/scoring/schema";

export type AnalyzeInput =
  | { mode: "url"; url: string }
  | { mode: "text"; text: string };

export class AnalyzeError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AnalyzeError";
  }
}

export async function runAnalysis(input: AnalyzeInput): Promise<ScoreResponse> {
  const body =
    input.mode === "url"
      ? { url: input.url }
      : { text: input.text };

  const res = await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let code: string | undefined;
    try {
      const errBody = (await res.json()) as { error?: string };
      code = errBody?.error;
    } catch {
      /* ignore */
    }
    throw new AnalyzeError(
      `Analysis failed (${res.status})${code ? `: ${code}` : ""}`,
      res.status,
      code,
    );
  }

  const data = await res.json();
  return scoreResponseSchema.parse(data);
}
