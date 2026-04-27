/**
 * Validated server-only environment access.
 * Importing this module in client code will throw at build time —
 * by design. Anything that needs a public value should go through
 * `next.config.ts` `env` block.
 */
import "server-only";

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const optional = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const env = {
  ANTHROPIC_API_KEY: required("ANTHROPIC_API_KEY"),
  LENS_MODEL: optional("LENS_MODEL", "claude-sonnet-4-6"),
  LENS_MAX_INPUT_CHARS: Number(optional("LENS_MAX_INPUT_CHARS", "24000")),
  LENS_REQUEST_TIMEOUT_MS: Number(optional("LENS_REQUEST_TIMEOUT_MS", "45000")),
} as const;

export type Env = typeof env;
