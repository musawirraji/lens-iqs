import { Fragment } from "react";
import type { SentenceFlag } from "@domain/scoring/schema";
import { FLAG_CATEGORIES } from "@domain/scoring/dimensions";
import styles from "./HighlightedArticle.module.scss";

interface Props {
  text: string;
  title?: string;
  source?: string;
  publishedAt?: string;
  wordCount: number;
  flags: SentenceFlag[];
}

const COLOR_BY_CATEGORY: Record<string, "red" | "yellow" | "blue"> = Object.fromEntries(
  FLAG_CATEGORIES.map((c) => [c.id, c.color]),
);

/**
 * Splits the article text into nodes — plain string segments and flagged
 * <span> segments. Builds a single ordered list of (start, end, flag) ranges
 * by searching for each flagged sentence's exact substring.
 */
export function HighlightedArticle({
  text,
  title,
  source,
  publishedAt,
  wordCount,
  flags,
}: Props) {
  const ranges = buildRanges(text, flags);
  const nodes = splitIntoNodes(text, ranges);
  const counts = countByColor(flags);

  return (
    <div className={styles.pane}>
      <div className={styles.kicker}>Article · Annotated</div>
      {title && <h1 className={styles.headline}>{title}</h1>}
      <div className={styles.byline}>
        {[source, publishedAt, `${wordCount.toLocaleString()} words`]
          .filter(Boolean)
          .join(" · ")}
      </div>

      <article className={styles.body}>
        {nodes.map((n, i) =>
          n.kind === "plain" ? (
            <Fragment key={i}>{renderParagraphs(n.text)}</Fragment>
          ) : (
            <span
              key={i}
              className={styles[`hl-${n.color}`]}
              title={n.reason}
              data-category={n.category}
            >
              {n.text}
            </span>
          ),
        )}
      </article>

      <div className={styles.legend}>
        <span><span className={`${styles.swatch} ${styles.red}`} />Unsupported · {counts.red}</span>
        <span><span className={`${styles.swatch} ${styles.yellow}`} />Emotional · {counts.yellow}</span>
        <span><span className={`${styles.swatch} ${styles.blue}`} />Missing context · {counts.blue}</span>
      </div>
    </div>
  );
}

// ---------- helpers ---------------------------------------------------------

type Range = {
  start: number;
  end: number;
  category: string;
  color: "red" | "yellow" | "blue";
  reason: string;
};

function buildRanges(text: string, flags: SentenceFlag[]): Range[] {
  const ranges: Range[] = [];
  for (const f of flags) {
    const idx = text.indexOf(f.sentence);
    if (idx === -1) continue;
    ranges.push({
      start: idx,
      end: idx + f.sentence.length,
      category: f.category,
      color: COLOR_BY_CATEGORY[f.category] ?? "yellow",
      reason: f.reason,
    });
  }
  // Sort and drop overlaps (first wins).
  ranges.sort((a, b) => a.start - b.start);
  const filtered: Range[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue;
    filtered.push(r);
    cursor = r.end;
  }
  return filtered;
}

type Node =
  | { kind: "plain"; text: string }
  | { kind: "hl"; text: string; category: string; color: "red" | "yellow" | "blue"; reason: string };

function splitIntoNodes(text: string, ranges: Range[]): Node[] {
  const out: Node[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) out.push({ kind: "plain", text: text.slice(cursor, r.start) });
    out.push({
      kind: "hl",
      text: text.slice(r.start, r.end),
      category: r.category,
      color: r.color,
      reason: r.reason,
    });
    cursor = r.end;
  }
  if (cursor < text.length) out.push({ kind: "plain", text: text.slice(cursor) });
  return out;
}

function renderParagraphs(text: string) {
  return text.split(/\n{2,}/).map((p, i, arr) => (
    <Fragment key={i}>
      {p}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

function countByColor(flags: SentenceFlag[]): Record<"red" | "yellow" | "blue", number> {
  const counts = { red: 0, yellow: 0, blue: 0 };
  for (const f of flags) {
    const c = COLOR_BY_CATEGORY[f.category];
    if (c) counts[c]++;
  }
  return counts;
}
