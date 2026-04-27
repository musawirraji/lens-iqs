/**
 * The 10 IQS scoring dimensions. Each scores 0-10. The aggregate IQS is
 * the sum (0-100). The order here is canonical and reflected in the UI.
 */

export const IQS_DIMENSIONS = [
  {
    id: "source_attribution",
    code: "SRC",
    label: "Source Attribution",
    description: "Are claims attributed to named, verifiable sources?",
  },
  {
    id: "evidence_density",
    code: "EVD",
    label: "Evidence Density",
    description: "Ratio of factual claims backed by data, studies, or documents.",
  },
  {
    id: "headline_accuracy",
    code: "HDL",
    label: "Headline Accuracy",
    description: "Does the headline reflect the article content or sensationalize?",
  },
  {
    id: "perspective_balance",
    code: "BAL",
    label: "Perspective Balance",
    description: "Are multiple viewpoints represented fairly?",
  },
  {
    id: "emotional_language",
    code: "EMO",
    label: "Emotional Language",
    description: "Degree of loaded, manipulative, or inflammatory phrasing.",
  },
  {
    id: "logical_coherence",
    code: "LOG",
    label: "Logical Coherence",
    description: "Are arguments structured logically without fallacies?",
  },
  {
    id: "contextual_completeness",
    code: "CTX",
    label: "Contextual Completeness",
    description: "Is relevant background and history included?",
  },
  {
    id: "transparency",
    code: "TRN",
    label: "Transparency",
    description: "Are methods, limitations, and conflicts of interest disclosed?",
  },
  {
    id: "specificity",
    code: "SPC",
    label: "Specificity",
    description: "Are claims specific and falsifiable vs vague and unfalsifiable?",
  },
  {
    id: "citation_quality",
    code: "CIT",
    label: "Citation Quality",
    description: "Are sources primary, authoritative, and accessible?",
  },
] as const;

export type DimensionId = (typeof IQS_DIMENSIONS)[number]["id"];
export type DimensionCode = (typeof IQS_DIMENSIONS)[number]["code"];

/**
 * The 3 sentence-level flag categories rendered as colored highlights.
 */
export const FLAG_CATEGORIES = [
  {
    id: "unsupported_claim",
    color: "red" as const,
    label: "Unsupported Claim",
    description: "A factual assertion with no source or evidence.",
  },
  {
    id: "emotional_framing",
    color: "yellow" as const,
    label: "Emotional Framing",
    description: "Loaded language, fear appeals, or outrage triggers.",
  },
  {
    id: "missing_context",
    color: "blue" as const,
    label: "Missing Context",
    description: "Statements that omit critical background or counterpoints.",
  },
] as const;

export type FlagCategoryId = (typeof FLAG_CATEGORIES)[number]["id"];
export type FlagColor = (typeof FLAG_CATEGORIES)[number]["color"];
