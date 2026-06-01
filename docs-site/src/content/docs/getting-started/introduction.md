---
title: Introduction
description: What LeFlux is, what it's for, and how it fits into any site.
---

LeFlux is a self-contained AI chat widget for the web. Drop one script tag on your site and visitors get a natural-language assistant that can read the current page, navigate across pages, fill out forms, and answer questions from a knowledge base built by crawling your site.

## What you get

- **Conversational agent**. The visitor types in any language; the agent reads context (current page, indexed elements, your site's knowledge base) and replies with both a message and, when needed, an action that's executed in the browser.
- **Site crawler**. Our crawler walks your site and stores each page's title, body text, headings, links, contact info, prices, and feature lists. The agent reads from this on every turn so it can answer most questions inline without making the visitor navigate.
- **Action execution**. Click, type, scroll, navigate, select. Composed into multi-step sequences. SPA-aware so React Router / Next.js routes don't blow away state.
- **Shadow DOM isolation**. Widget styles live in their own shadow root — they can't break your site's CSS, and your site's CSS can't break the widget.
- **Three layouts** — floating bubble, bottom-bar pill, side-panel drawer. Pick per-site from the dashboard.
- **Multi-tenant cloud**. One install, multiple sites. Each site has its own theme, greeting, allowed-host list, and crawled knowledge base.

## Who it's for

| You are                                        | LeFlux is                                                                 |
|------------------------------------------------|---------------------------------------------------------------------------|
| A SaaS founder with a docs/marketing site     | An AI concierge that answers product questions + walks visitors to features. |
| A portfolio / agency site owner                | A "hire me" / "tell me about X project" agent that fills your contact form for the visitor. |
| An e-commerce store                            | A pre-purchase assistant that finds products, answers FAQs, walks the visitor to checkout. |
| A team that already built a custom chatbot     | A faster, generic alternative that doesn't need per-page rules.           |

## What LeFlux is NOT

- **Not a generic LLM chat**. It's tied to your site — it reads your pages, navigates within your routes, fills your forms.
- **Not framework-specific**. It runs on any HTML page. React/Vue/Angular/static — same script.
- **Not a code generator**. It executes pre-built primitives (click/type/scroll/navigate/select), not arbitrary JS.

## Next step

Get a working install in under five minutes. See [Quick start](/docs/getting-started/quick-start/).
