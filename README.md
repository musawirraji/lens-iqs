# Lens — Intelligence Quality Score (IQS) Demo

Investor-demo prototype of the IQS article-credibility scoring tool.
Wraps the Anthropic Claude API with a custom 10-dimension scoring prompt and
returns a structured JSON breakdown plus sentence-level flagging.

> Bloomberg Terminal meets Moody's, for editorial signal.

---

## What it does

1. Accepts an **article URL** (server-scraped via cheerio) or **pasted text**.
2. Sends the text + IQS scoring prompt to **Claude** through a Vercel Edge Function.
3. Returns:
   - **Aggregate IQS** (0–100) — sum of 10 dimensional scores.
   - **10 dimension scores** (0–10 each).
   - **Sentence-level flags** in three categories: Unsupported Claims (red),
     Emotional Framing (yellow), Missing Context (blue).
4. Renders an institutional, Bloomberg-style dashboard.

## Stack

- **Next.js 16** (App Router, React 19)
- **Vercel Edge Function** for the `/api/score` proxy (key never leaves the server)
- **Anthropic SDK** with structured-output JSON
- **cheerio** for server-side article scraping
- **SCSS Modules** with prepended design tokens
- **Zod** for runtime validation of Claude's response

## Project structure (DDD)

```
lens-iqs/
├── app/                            # Next.js App Router
│   ├── api/score/route.ts          # Edge function: Claude proxy
│   ├── layout.tsx
│   ├── page.tsx                    # Single-page app shell
│   └── globals.scss
├── src/
│   ├── domain/                     # Pure business logic, no framework deps
│   │   ├── article/                # Article entity + parsing
│   │   └── scoring/                # IQS dimensions, prompt, schema, service
│   ├── features/                   # Vertical slices (UI + use-cases)
│   │   ├── analyze/                # Input panel, run orchestration
│   │   └── results/                # Score, breakdown, highlighted body
│   ├── infrastructure/             # External-service adapters
│   │   ├── claude/                 # Anthropic SDK wrapper
│   │   └── scraper/                # cheerio article scraper
│   ├── shared/                     # Cross-feature primitives
│   │   ├── components/             # Button, etc.
│   │   ├── design/                 # SCSS tokens, typography, mixins
│   │   └── utils/
│   ├── lib/
│   │   └── env.ts                  # Validated env access
│   └── types/
└── public/
```

## Getting started

```bash
git clone <repo>
cd lens-iqs
npm install
cp .env.example .env.local           # fill in ANTHROPIC_API_KEY
npm run dev
```

Open `http://localhost:3000`.

## Deploying to Vercel

1. Push to a GitHub repo.
2. Import the repo in Vercel.
3. Add `ANTHROPIC_API_KEY` to **Project Settings → Environment Variables**
   (Production + Preview). Do **not** prefix with `NEXT_PUBLIC_`.
4. Deploy. The Edge Function at `/api/score` will read the key at runtime.

## Security boundary

- The client **never** sees the Claude API key.
- The client `POST`s `{ url?: string, text?: string }` to `/api/score`.
- The Edge Function attaches the key from `process.env.ANTHROPIC_API_KEY`,
  scrapes the URL if supplied, and forwards to Claude.
- Claude returns JSON, the Edge Function validates with Zod, then returns to the client.

## Brand

- Navy `#0A1628` primary background
- Gold `#D4A843` single accent
- **Newsreader** for editorial heads and long-form body
- **IBM Plex Sans** for UI
- **IBM Plex Mono** for scores and numerals

## Scope boundaries

This is a demo. It is **not**:
- A production-grade scoring system.
- A custom-trained model.
- Multi-article batch infrastructure.

It is intentionally a wrapper around Claude with a strong prompt and a clean dashboard.

---

© Lens. Full IP transfer on signed contract.
