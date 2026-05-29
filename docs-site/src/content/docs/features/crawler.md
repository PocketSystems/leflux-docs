---
title: Site crawler & knowledge base
description: How LeFlux builds the knowledge graph that powers inline answers.
---

A Playwright-based crawler runs against your site to build the knowledge base that lets the agent answer factual questions inline without navigating the visitor anywhere.

## Trigger

- **Manual** — Dashboard → Site detail → **Start crawl** (recommended after content updates).
- **On install** — the first crawl is auto-triggered when you add a site.

Scheduled recurring crawls are on the roadmap; today you re-run manually when your content changes.

## What it does

BFS walk starting from the site root. For each page:

1. Loads the page in a headless Chromium with `domcontentloaded` + a 1s settle wait so JS-rendered content finishes.
2. Extracts:
   - `<title>`
   - `<meta name="description">`
   - All headings (h1–h3) with text + level
   - Visible text body (de-dup'd, scripts/styles stripped)
   - All in-domain links (for the BFS frontier)
   - Typography signals (heading-font, body-font, button-radius detected via computed styles)
   - Dominant accent color sampled from the page palette
3. Stores per-page in Firestore under `sites/<siteId>/pages/<docId>`.
4. Aggregates site-level signals: detected primary color, button radius, font stack.

## Limits

| Setting              | Default                                                                |
|----------------------|------------------------------------------------------------------------|
| Page cap (Free)      | 50 pages                                                              |
| Page cap (Pro)       | 500 pages                                                             |
| Page cap (Enterprise)| 5,000 pages                                                            |
| Depth cap            | None — bounded only by the page cap above.                            |
| Per-page text limit  | Truncated past the document size that fits in Firestore's 20MB doc cap. |
| User-Agent           | `Mozilla/5.0 (compatible; LeFluxCrawler/1.0; +https://leflux.xrlabs.app)` |
| Concurrency          | 1 (sequential). Polite — we don't burn your host's bandwidth.          |
| Heartbeat            | Every 8s. Stale jobs (no heartbeat > 90s) are auto-reaped.            |

## What gets ignored

- URLs that 4xx / 5xx.
- Non-HTML responses (PDFs, images, JSON, video).
- URLs outside your registered domain (cross-origin links).

Note: today's crawler does NOT consult `robots.txt` or `noindex` meta tags. Pages reachable from your root via in-domain links are eligible to be crawled up to the plan cap. If you need to exclude specific paths, add them to the ignored-paths list in **Settings → Crawler** (planned — track [this issue](https://github.com/PocketSystems/leflux-docs/issues) for status).

## Live progress

While a crawl runs, the dashboard shows:

- Pages discovered (BFS frontier size)
- Pages walked (completed)
- Current URL
- Recent text excerpts

The crawler emits a heartbeat every 8s so a stalled run is detected and reaped within 60s (no zombie "scanning…" status forever).

## Re-crawl

Re-running replaces the previous crawl. Pages no longer reachable from the root are pruned. URLs whose hash changed are re-extracted. URLs whose hash is identical are skipped (no wasted work).

To force a full re-extraction (e.g. after a major redesign), delete the site and re-create — gives you the cleanest state.

## How the LLM uses it

On every visitor turn the server:

1. Ranks crawled pages by relevance to the visitor's latest message (field-weighted token scoring against title + headings + body text).
2. Injects the top-3 most relevant pages' summaries, headings, notes, AND raw body text excerpts (up to 2500 chars each) as a `# Cross-page knowledge` block at the top of the prompt.
3. Extracts emails + phone numbers from those pages and prepends a `## Site contacts` block.
4. Always emits the full Sitemap (every crawled path + title) so the agent can reference any page by name.

For info questions ("what's your phone number?", "what does plan X include?", "show me your team") the agent answers from this block — no navigation. For navigational requests it pulls the URL verbatim from the Sitemap.

## Inspecting the crawl

Site detail → **Site Scan** lists every crawled page with its title, URL, and a preview of the extracted text. Open one to see the full body text + headings + links — exactly what the LLM sees.

If a question isn't being answered well, check whether the source page is crawled with the relevant content. Often the fix is a re-crawl after a content update, or expanding the page cap if your site has more than 60 pages worth of useful content.

## Privacy

The crawler only fetches pages reachable from your site root — same as a search engine. It doesn't access auth-gated URLs (no cookie store, no login flow), doesn't bypass any access control. Content is stored in Firestore under your tenant's site doc; no cross-tenant data sharing.

If your site has a `robots.txt` you want enforced, the recommended approach today is to keep sensitive content behind auth (the crawler can't reach those pages). Per-path exclusions in the dashboard are on the roadmap.
