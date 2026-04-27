import type { IQSResult } from "@domain/scoring/schema";
import styles from "./AggregateScore.module.scss";

interface Props {
  result: IQSResult;
}

export function AggregateScore({ result }: Props) {
  const grade = letterGrade(result.aggregate);

  return (
    <section className={styles.block}>
      <div className={styles.label}>Aggregate IQS</div>
      <div className={styles.row}>
        <div className={styles.num}>{Math.round(result.aggregate)}</div>
        <div className={styles.of}>/100</div>
        <div className={styles.gradeBox}>
          <div className={styles.grade}>{grade}</div>
          <div className={styles.gradeLabel}>Composite</div>
        </div>
      </div>
      <div className={styles.verdict}>{result.verdict}</div>
    </section>
  );
}

function letterGrade(n: number): string {
  if (n >= 93) return "A";
  if (n >= 87) return "A-";
  if (n >= 83) return "B+";
  if (n >= 77) return "B";
  if (n >= 70) return "B-";
  if (n >= 63) return "C+";
  if (n >= 57) return "C";
  if (n >= 50) return "C-";
  if (n >= 40) return "D";
  return "F";
}
