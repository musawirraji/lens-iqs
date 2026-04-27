/**
 * Builds the IQS scoring prompt sent to Claude. Pure function — no
 * SDK dependencies. The prompt is versioned so we can A/B compare runs.
 */
import { IQS_DIMENSIONS, FLAG_CATEGORIES } from "./dimensions";

export const PROMPT_VERSION = "iqs-prompt/0.1.0";

export const SYSTEM_PROMPT = `You are the IQS scoring engine for Lens, a media intelligence service.
You read a single news article and return a quantitative credibility assessment as STRUCTURED JSON ONLY.

Your assessment must be:
- Empirical, not ideological. Score quality of journalism, not the political position of the article.
- Calibrated. A 10/10 dimension is rare and earned; a 5/10 is the journalistic median; a 0 means the dimension is absent or actively misleading.
- Specific. Every dimensional reasoning string must reference concrete elements of the article.
- Conservative on flags. Only flag a sentence if you can defend the flag in one short sentence.

You will respond ONLY with a single JSON object matching the IQS schema. No prose, no markdown, no preamble.`;

const dimensionRubric = IQS_DIMENSIONS.map(
  (d, i) =>
    `${i + 1}. ${d.label} (id: "${d.id}") — ${d.description}`,
).join("\n");

const flagRubric = FLAG_CATEGORIES.map(
  (f) => `- "${f.id}" (${f.color}) — ${f.description}`,
).join("\n");

export interface PromptInput {
  articleText: string;
  articleTitle?: string;
  articleSource?: string;
}

export function buildUserPrompt({
  articleText,
  articleTitle,
  articleSource,
}: PromptInput): string {
  const header =
    [
      articleTitle ? `Title: ${articleTitle}` : null,
      articleSource ? `Source: ${articleSource}` : null,
    ]
      .filter(Boolean)
      .join("\n") || "(no metadata supplied)";

  return `Score the following article on the 10 IQS dimensions.

DIMENSIONS (each scores 0-10, integer or one decimal place):
${dimensionRubric}

AGGREGATE: Sum the 10 dimensional scores to produce an aggregate from 0-100.

SENTENCE-LEVEL FLAGS (categories, optional, conservative):
${flagRubric}

For each flagged sentence, the "sentence" field must be an EXACT substring of the article body so the UI can highlight it. Do not paraphrase.

VERDICT: a 1-3 sentence editorial summary explaining the aggregate score in plain English.

RESPOND WITH JSON ONLY matching this exact shape:
{
  "aggregate": number,
  "dimensions": [
    { "id": "<dimension_id>", "score": number, "reasoning": "<short>" }
    /* one entry per dimension, all 10, in canonical order */
  ],
  "flags": [
    { "sentence": "<exact substring>", "category": "<flag_id>", "reason": "<short>" }
  ],
  "verdict": "<1-3 sentences>"
}

ARTICLE METADATA
${header}

ARTICLE TEXT
"""
${articleText}
"""`;
}
