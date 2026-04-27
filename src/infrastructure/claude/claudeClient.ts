/**
 * Singleton Anthropic client. Imported only by domain/infrastructure code
 * running on the server (or Edge runtime). The client throws if accessed
 * from a context without ANTHROPIC_API_KEY.
 *
 * IMPORTANT: This module imports `server-only` so any accidental client-
 * bundle reference fails at build time.
 */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@lib/env";

declare global {
  // Cache the client across hot reloads in dev.
  // eslint-disable-next-line no-var
  var __lens_claude__: Anthropic | undefined;
}

export const claude: Anthropic =
  globalThis.__lens_claude__ ??
  new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    timeout: env.LENS_REQUEST_TIMEOUT_MS,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__lens_claude__ = claude;
}
