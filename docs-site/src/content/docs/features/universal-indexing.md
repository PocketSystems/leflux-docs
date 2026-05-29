---
title: Universal indexing
description: How LeFlux refers to page elements without CSS selectors.
---

The widget can't write CSS selectors. Selectors break the moment a site changes markup, and they don't generalize across tenants. Instead, every interactive element on the current page is assigned a fresh numeric id on every page-context scan.

## What gets indexed

On each scan the inspector walks the live DOM and collects elements matching:

- All `<a>` with href
- All `<button>`
- All form fields: `<input>`, `<textarea>`, `<select>`
- All `[role=]` widgets: button, link, menuitem, checkbox, radio, switch, combobox, option, treeitem, searchbox, textbox
- `<summary>` (details trigger)
- `[onclick]`, `[tabindex]`, `[contenteditable]`, `[data-action]`

Visible-only. Closed disclosures (`<details>` without `open`, `[aria-expanded=false]`) skip their contents. Trivial chrome (cookie banners, social-share strips, tracking pixels) is filtered out.

## What each entry looks like

```json
{
  "id": 14,
  "type": "input",
  "text": "Your name",
  "placeholder": "Your name",
  "required": true,
  "parent": "Drop a Message",
  "visible": true
}
```

Fields:

| Field        | Meaning                                                                                 |
|--------------|-----------------------------------------------------------------------------------------|
| `id`         | Numeric, fresh per scan. Maps to a live DOM element via `data-leflux-id`.              |
| `type`       | Element kind. For inputs, the input type (`text`, `email`, `number`, etc).             |
| `text`       | Visible text, or label, or placeholder, whichever's most descriptive.                  |
| `placeholder`| Raw placeholder (if any).                                                              |
| `value`      | Current value (first 50 chars, only if non-empty).                                     |
| `href`       | For `<a>` elements.                                                                    |
| `ariaLabel`  | For elements with `aria-label`.                                                        |
| `options`    | For `<select>`, the list of option labels.                                             |
| `required`   | `true` when element has native `required`, `aria-required="true"`, or required attr.   |
| `disabled`   | `true` when disabled.                                                                   |
| `parent`     | Nearest meaningful container's text (form heading, card title, modal title).           |
| `inModal`    | `true` when the element lives inside an open modal/dialog.                             |

`parent` is what disambiguates duplicate labels. If a product listing has six "Add to Cart" buttons, they all share `text: "Add to Cart"` but have different `parent` values (`"iPhone 16"`, `"AirPods Pro"`, etc), and the agent can target by parent.

## Scoring + cap

Candidates are scored by viewport relevance + element type + interactivity. Top **250** survive into the indexed list on the widget side. The server further truncates to the top **150** before sending to the LLM, keeping prompt size bounded.

If the agent's target id isn't in the list, the element isn't visible / isn't rendered. The agent's correct response is to scroll, click a disclosure trigger, navigate, or wait — never guess at an id.

## Re-indexing

The list refreshes on every page-context scan. The widget scans:

- When the chat first opens
- Before each action emission to the server
- After each action execution
- On SPA route change (History API listener)
- After significant DOM mutation (MutationObserver, debounced)

Each scan increments a generation counter; ids from a prior scan are stale and won't resolve if the agent tries to use them.

## Why not CSS selectors

CSS selectors break in three places:

1. **Tenant variability** — `#submit` on one site is `.btn-primary` on another. Selectors need per-tenant rules.
2. **Re-renders** — React / Vue re-renders change ids and class names. A selector that worked at scan-time fails at click-time.
3. **Hash collisions** — modern frameworks emit hashed class names (`.MuiButton-root-xyz123`) that change every build.

Numeric ids dodge all three. The id-to-element map is rebuilt every scan, so it's always fresh.

## Inspector internals

Want to see the indexer at work? Open DevTools console and run:

```js
const host = document.getElementById('ai-chat-widget-container');
host.shadowRoot.querySelector('[data-leflux-id="5"]'); // returns the live DOM node for id 5
```

Every indexed element has `data-leflux-id="<n>"` written directly on it.
