import { IQS_DIMENSIONS } from "@domain/scoring/dimensions";
import type { DimensionScore } from "@domain/scoring/schema";
import styles from "./DimensionBreakdown.module.scss";

interface Props {
  dimensions: DimensionScore[];
}

export function DimensionBreakdown({ dimensions }: Props) {
  // Index by id so we render in canonical IQS_DIMENSIONS order even if
  // Claude returned them out of order.
  const byId = new Map(dimensions.map((d) => [d.id, d]));

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <span>#</span>
        <span>Dimension</span>
        <span className={styles.right}>Score</span>
        <span />
      </header>

      {IQS_DIMENSIONS.map((d, i) => {
        const score = byId.get(d.id)?.score ?? 0;
        const tier = scoreTier(score);
        return (
          <div
            key={d.id}
            className={`${styles.row} ${styles[tier]}`}
            title={byId.get(d.id)?.reasoning}
          >
            <div className={styles.idx}>{(i + 1).toString().padStart(2, "0")}</div>
            <div className={styles.name}>
              {d.label}
              <small>{d.code}</small>
            </div>
            <div className={styles.score}>{score.toFixed(1)}</div>
            <div className={styles.bar}>
              <div className={styles.fill} style={{ width: `${score * 10}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function scoreTier(score: number): "high" | "mid" | "low" {
  if (score >= 7.5) return "high";
  if (score >= 6) return "mid";
  return "low";
}
