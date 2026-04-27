"use client";

import { useState } from "react";
import { InputPanel } from "@features/analyze/ui/InputPanel/InputPanel";
import { runAnalysis, AnalyzeError } from "@features/analyze/application/analyzeUseCase";
import { AggregateScore } from "@features/results/ui/AggregateScore/AggregateScore";
import { DimensionBreakdown } from "@features/results/ui/DimensionBreakdown/DimensionBreakdown";
import { HighlightedArticle } from "@features/results/ui/HighlightedArticle/HighlightedArticle";
import type { ScoreResponse } from "@domain/scoring/schema";
import styles from "./page.module.scss";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScoreResponse | null>(null);

  const handleSubmit = async ({ mode, value }: { mode: "url" | "text"; value: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAnalysis(
        mode === "url" ? { mode: "url", url: value } : { mode: "text", text: value },
      );
      setData(res);
    } catch (e) {
      setError(e instanceof AnalyzeError ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.masthead}>
        <div className={styles.left}>
          <div className={styles.wordmark}>
            LENS<span>·</span>IQS
          </div>
          <div className={styles.breadcrumb}>
            Analysis › Single Article{data ? ` › Run #${data.meta.runId.slice(0, 8)}` : ""}
          </div>
        </div>
        <div className={styles.right}>
          <span className={styles.statusDot} />
          <span>{loading ? "Scoring…" : data ? `${data.meta.elapsedMs}ms` : "Idle"}</span>
        </div>
      </header>

      <InputPanel loading={loading} onSubmit={handleSubmit} />

      {error && <div className={styles.error}>{error}</div>}

      {!data && !loading && (
        <div className={styles.empty}>
          <p>
            Submit an article URL or paste article text to begin scoring across
            10 dimensions of credibility.
          </p>
        </div>
      )}

      {data && (
        <div className={styles.stage}>
          <HighlightedArticle
            text={data.article.text}
            title={data.article.title}
            source={data.article.source}
            publishedAt={data.article.publishedAt}
            wordCount={data.article.wordCount}
            flags={data.result.flags}
          />
          <aside className={styles.scoringPane}>
            <AggregateScore result={data.result} />
            <DimensionBreakdown dimensions={data.result.dimensions} />
          </aside>
        </div>
      )}
    </div>
  );
}
