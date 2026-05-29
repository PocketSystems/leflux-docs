---
title: How it works
description: The iterative loop, universal indexing, knowledge-base injection, action primitives.
---

LeFlux is built on four ideas. Understanding them helps you debug, customize, and trust the agent.

## 1. Universal indexing

The widget can't write CSS selectors — different sites have different markup, and selectors break the moment a host site re-renders. Instead, on every turn, the widget scans the page and assigns a fresh numeric `id` to every interactive element (links, buttons, inputs, selects, role-based widgets). Each id maps to a real DOM element via a `data-leflux-id` attribute.

The agent receives a list like:

```json
[
  { "id": 5,  "type": "a",      "text": "Contact",     "href": "/#contact", "parent": "nav" },
  { "id": 12, "type": "input",  "text": null,          "placeholder": "Your name", "required": true, "parent": "Drop a Message" },
  { "id": 13, "type": "input",  "text": null,          "placeholder": "Email",     "required": true, "parent": "Drop a Message" },
  { "id": 19, "type": "button", "text": "Send",        "parent": "Drop a Message" }
]
```

When the agent emits `click 12` the widget looks up element 12, scrolls it into view, checks for blocking overlays, and executes the click. Same model for every site — no per-tenant configuration.

## 2. Iterative loop

A single visitor message doesn't always map to a single action. "Hire Fahad" might mean: navigate to home → scroll to contact section → ask the visitor for their name and email → fill the form → click submit.

The loop runs server-side, up to 30 iterations:

```
[visitor message]
   ↓
   LLM call → { message, action } ────┐
   ↓                                  │
   widget executes action ────────────┤
   ↓                                  │
   new page context ──────────────────┘
   ↓
   (repeat until task_complete or guard fires)
```

Each iteration the LLM sees:

- The latest page context (URL, indexedElements, visibleText, forms, previouslyFilledFields).
- The site's Sitemap + crawled knowledge.
- The state trace of the previous action ("URL unchanged at /x — try a different strategy").

Guards break the loop when progress stalls — same elementId clicked 3x, same URL navigated 2x in a row, scroll-only emissions 3x.

## 3. Knowledge-base injection

A Playwright crawler walks your site (BFS, configurable depth + cap) and stores for each page:

- canonical URL + pathname
- page title + meta description
- headings (h1–h3)
- the visible text body
- structured signals (links, contact info via regex, prices, FAQ pairs)

On every LLM call, the server:

1. Ranks crawled pages by relevance to the visitor's latest message.
2. Injects the top-K pages' summaries, headings, notes, AND raw body text excerpts as a "Cross-page knowledge" block at the top of the prompt.
3. Extracts emails + phone numbers from all top-K pages and injects them as a "Site contacts" block.

For info questions ("what's your phone number") the agent answers from the knowledge base inline — zero navigation. For navigational requests ("take me to pricing") the agent navigates using a URL pulled verbatim from the Sitemap.

## 4. Action primitives

The agent emits actions, not code. Five primitives:

| Action     | Args                                                                                      |
|------------|-------------------------------------------------------------------------------------------|
| `click`    | `elementId`                                                                               |
| `type`     | `elementId`, `inputData`                                                                  |
| `select`   | `elementId`, `inputData` (must match an option)                                           |
| `scroll_to`| `elementId`                                                                               |
| `navigate` | `url` (path or full URL — pulled from Sitemap)                                            |
| `wait`     | `waitDuration` (ms)                                                                       |

Compose them into a sequence (`execute_generic_sequence`) for atomic multi-step flows. Form submit, for example, lands as a single sequence:

```json
{
  "type": "execute_generic_sequence",
  "steps": [
    { "action": "type",  "elementId": 12, "inputData": "Ahmed Khan" },
    { "action": "type",  "elementId": 13, "inputData": "ahmed@example.com" },
    { "action": "type",  "elementId": 14, "inputData": "Hi, interested in pricing." },
    { "action": "click", "elementId": 19, "description": "submit" }
  ]
}
```

The widget validates each step, retries on transient failures (overlay, async dropdown), and reports the result back to the server which feeds the next iteration.

## Where the magic happens

| Concern                         | Lives in                                |
|----------------------------------|------------------------------------------|
| Element scanning + indexing      | `widget/src/dom-inspector.js`           |
| Action execution + retry         | `widget/src/action-executor.js`         |
| Iterative LLM loop               | `server/src/llm-integration.js`         |
| Loop guards + state traces       | `server/src/websocket-handler.js`       |
| Knowledge-base ranking           | `server/src/page-context.js`            |
| Site crawl (BFS + extraction)    | `crawler/src/crawl.js`                  |

[Next → Install on any site](/docs/install/script-tag/).
