import type { NextConfig } from "next";
import path from "node:path";

// Resolve from the running project root. `process.cwd()` is reliable in
// next.config.ts under both webpack and turbopack; `__dirname` is not.
const designPath = path.join(process.cwd(), "src/shared/design");

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Globally prepend design tokens + typography to every SCSS module so
  // components can use $color-*, $font-*, $space-*, mixins, etc., without
  // explicit @use lines.
  //
  // - `loadPaths` is the modern Dart Sass name; `includePaths` is the
  //   legacy alias kept for compatibility across Sass API versions.
  // - `prependData` and `additionalData` are both set because Next.js has
  //   shipped both spellings across versions; setting both is bulletproof.
  sassOptions: {
    loadPaths: [designPath],
    includePaths: [designPath],
    silenceDeprecations: ["legacy-js-api", "import"],
    prependData: `@use "tokens" as *;\n@use "typography" as *;\n`,
    additionalData: `@use "tokens" as *;\n@use "typography" as *;\n`,
  },
  // The Claude API key is server-only. Never expose to the client bundle.
  env: {
    LENS_VERSION: "0.1.0",
  },
};

export default config;
