/**
 * Edge Function: POST /api/score
 *
 * The single boundary where the Anthropic API key is read. Client sends
 * { url?: string; text?: string }. We scrape if URL, score, validate, return.
 *
 * The key NEVER leaves this file's process.
 */
import { NextResponse } from "next/server";
import { scoreArticle } from "@domain/scoring/scoringService";
import { scrapeArticle } from "@infra/scraper/articleScraper";
import { createArticle } from "@domain/article/article";
import { scoreRequestSchema } from "@domain/scoring/schema";

// Note: cheerio is Node-only. If targeting the Edge runtime, swap the
// scraper for an Edge-compatible parser (e.g., linkedom). For the demo,
// "nodejs" runtime is fine and keeps cheerio available.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = scoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { url, text } = parsed.data;
  const runId = crypto.randomUUID();

  try {
    const article = url
      ? await scrapeArticle(url)
      : createArticle({ text: text! });

    const scored = await scoreArticle({
      text: article.text,
      title: article.title,
      source: article.source,
    });

    return NextResponse.json({
      result: scored.result,
      article: {
        title: article.title,
        source: article.source,
        publishedAt: article.publishedAt,
        wordCount: article.wordCount,
        text: article.text,
      },
      meta: {
        model: scored.model,
        elapsedMs: scored.elapsedMs,
        runId,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    const status = message.startsWith("scraper/") ? 422 : 500;
    return NextResponse.json({ error: message, runId }, { status });
  }
}
