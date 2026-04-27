"use client";

import { useState } from "react";
import styles from "./InputPanel.module.scss";

type Mode = "url" | "text";

interface Props {
  loading: boolean;
  onSubmit: (input: { mode: Mode; value: string }) => void;
}

export function InputPanel({ loading, onSubmit }: Props) {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const canSubmit =
    !loading &&
    ((mode === "url" && url.trim().length > 8) ||
      (mode === "text" && text.trim().length >= 50));

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({ mode, value: mode === "url" ? url.trim() : text.trim() });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === "url" ? styles.active : ""}`}
          onClick={() => setMode("url")}
          type="button"
        >
          URL
        </button>
        <button
          className={`${styles.tab} ${mode === "text" ? styles.active : ""}`}
          onClick={() => setMode("text")}
          type="button"
        >
          Paste Text
        </button>
      </div>

      <div className={styles.field}>
        {mode === "url" ? (
          <>
            <span className={styles.pre}>SRC</span>
            <input
              className={styles.input}
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={loading}
            />
          </>
        ) : (
          <textarea
            className={styles.textarea}
            placeholder="Paste article text here (minimum 50 characters)…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            rows={3}
          />
        )}
      </div>

      <button
        className={styles.run}
        onClick={submit}
        disabled={!canSubmit}
        type="button"
      >
        {loading ? "Analyzing…" : "Run · ⏎"}
      </button>
    </div>
  );
}
