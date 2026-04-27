/**
 * Article domain entity. Represents an article whether it came from a
 * scraped URL or pasted text. Knows nothing about Claude or HTTP.
 */
export interface Article {
  text: string;
  title?: string;
  source?: string;
  publishedAt?: string;
  wordCount: number;
}

export function createArticle(input: {
  text: string;
  title?: string;
  source?: string;
  publishedAt?: string;
}): Article {
  const trimmed = input.text.trim();
  return {
    text: trimmed,
    title: input.title,
    source: input.source,
    publishedAt: input.publishedAt,
    wordCount: countWords(trimmed),
  };
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}
