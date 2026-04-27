/**
 * Server-side article scraper. Uses cheerio to pull readable body text from
 * a URL. Intentionally simple — production would swap in Diffbot, Mercury,
 * or a custom Readability port. This is good enough for the demo.
 */
import "server-only";
import * as cheerio from "cheerio";
import { createArticle, type Article } from "@domain/article/article";

const USER_AGENT =
  "Mozilla/5.0 (compatible; LensBot/0.1; +https://lens.example.com/bot)";

export async function scrapeArticle(url: string): Promise<Article> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`scraper/fetch_failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Strip noise.
  $("script, style, nav, footer, aside, iframe, noscript, .ad, .advertisement").remove();

  // Try common article containers in order of specificity.
  const candidates = [
    "article",
    "[role=main]",
    "main",
    ".article-body",
    ".post-content",
    ".entry-content",
    "#content",
    "body",
  ];

  let bodyEl: cheerio.Cheerio<any> | null = null;
  for (const sel of candidates) {
    const found = $(sel).first();
    if (found.length && found.text().trim().length > 200) {
      bodyEl = found;
      break;
    }
  }

  const paragraphs =
    bodyEl
      ?.find("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((p) => p.length > 30) ?? [];

  const text = paragraphs.join("\n\n");

  if (!text || text.length < 200) {
    throw new Error("scraper/no_content");
  }

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    undefined;

  const publishedAt =
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="date"]').attr("content") ||
    undefined;

  const source = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return undefined;
    }
  })();

  return createArticle({ text, title, source, publishedAt });
}
