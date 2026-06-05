---
title: Release notes
description: What's new in LeFlux.
---

Reverse chronological. Dates are the date the change landed in production.

## 2026-06-05

### Widget

- **Side-panel close polished**: closing the side panel now slides fully off screen in perfect sync with the page content returning to position. The close animation mirrors the open animation exactly, with no fade or lag.
- **Smarter "what's new" answers**: asking the AI what changed or what's new now returns a real synthesized answer from the visible content, instead of a list of dates with a follow-up question about which one you meant.

## 2026-06-04

### Widget

- **Side-panel blends into your site** — the side-panel drawer now samples your page's background colour right at its edge and adopts it as its own surface, re-tinting smoothly as visitors scroll past differently-coloured sections. The old hard drop-shadow is gone, replaced by a hairline left border in a tone derived from your site — so the panel reads as a native part of the page, not a floating slab.
- **Sharper on dark themes** — on dark sites the floating + bottom-bar widget surfaces now lift to a slightly lighter tone derived from your page background, so the widget stands out as raised chrome instead of melting into a dark background. Fully automatic, per-site.
- **Switch layouts from the chat header** — visitors can flip the widget between floating, bottom-bar, and side-panel on the fly using icon buttons in the header. Their choice persists across reloads (along with the open/closed state). Admins who want a fixed layout can turn on the new **Lock layout** option to hide the switcher.
- **Mobile is always floating** — on phones (≤ 640px) the widget renders as the floating bubble (full-screen sheet on open) no matter which layout you picked; the layout switcher is hidden there. Side-panel and bottom-bar stay desktop-only. Your desktop layout is unchanged.
- **Smoother side-panel close** — the drawer slides out to mirror its open, stays full-width through the animation, and the page content glides back in sync — no mid-animation shrink, no jerk.

### Dashboard

- **Lock layout** — Settings → Appearance → Layout. When on, visitors can't switch layouts from the chat header and every reload keeps your chosen layout.
- **Settings apply instantly** — saving widget settings (color, greeting, layout, lock, launcher) now busts the server-side config cache immediately, so live widgets reflect the change on the next page load instead of up to ~15s later.
- **Transfer a site to another account** — Settings → Danger → **Transfer site**. Enter the destination account's email (verified live before you commit) and ownership moves over instantly; the widget keeps serving with no interruption or re-crawl.
- **Live preview auto-opens** — switching the widget layout in Settings now opens the live preview in that layout immediately, so you see the change without a manual click.

## 2026-05-27

### Widget

- **`window.LeFlux` public API shipped** — open / close / toggle / send / ask / setVisitorData / clearConversation / dock / undock / showLauncher / reindex / destroy, plus state getters (`isReady` / `isOpen` / `isExpanded` / `getState` / `getLanguage` / `getSessionId`). Backwards-compat: `window.AIChatWidget` still exists as the underlying instance.
- **Granular event stream** — added `leflux:state-change`, `leflux:typing-start` / `:typing-end`, `leflux:expand` / `:collapse`, `leflux:navigating`, `leflux:language-detected`, `leflux:destroy` to the existing `leflux:ready` / `:open` / `:close` / `:message` / `:reply` / `:action` / `:task_complete` / `:error` set.
- **Conversation state machine** — single source of truth (`idle` / `typing` / `processing` / `navigating` / `awaiting-input`) exposed via `LeFlux.getState().conversation` and the `state-change` event. Drives analytics + custom UI.
- **Hide launcher mode** — new dashboard toggle (Settings → Launcher → "Hide launcher button"). Widget mounts + stays connected; the floating button is invisible. Chat opens only via `window.LeFlux.open()` from your own UI.
- **Log discipline** — `[LeFlux]` console logs are now silent on customer production hostnames. Enable on prod for support cases by adding `data-debug="true"` to the embed `<script>`. Errors always remain loud.

### Server

- **Language on every payload** — `message_done`, `message`, `action_plan`, `task_complete` now carry a normalized `language` slug (`'en'`, `'roman-urdu'`, `'de'`, …) so client-side `LeFlux.getLanguage()` is always fresh.

## 2026-05-26

- **Developer docs site** launched at [/docs](https://leflux.ai/docs/). Searchable, dark + light mode, full coverage of installation, configuration, features, API.

## 2026-05-25

### Widget

- **Floating composer redesign** — input pill now lives INSIDE the chat-window (was a separate bar below on bottom-bar layout). Unified surface across docked + floating modes.
- **Ultra-thin header** — replaced solid purple banner with glassmorphic blended bar (~50px tall, was ~70). Header now reads as part of the panel, not a marketing slab.
- **Modern input field** — sparkle icon prefix (themed to primary color), Enter ↵ kbd hint, rounded square send button with glossy hover sweep, transparent surround so messages flow seamlessly behind the pill.
- **Configurable launcher** — shape (circle/squircle/pill), size (sm/md/lg), icon (chat/sparkle/question/lightning/cursor), position offset, glow toggle. All from the dashboard.
- **Nudge messages** — optional proactive tooltip near the launcher. Styles: bubble, card, minimal. 24h dismissal cooldown. Renders on all three layouts (floating, bottom-bar, side-panel).
- **Dock side-panel mode** — true side drawer with host body push, fixed-element shifting (nav bars repositioned to clear the panel), seamless input + scroll handling.
- **Required field detection** — indexedElements now expose `required: true` for inputs with native required / aria-required. Form-fill never skips a required field.
- **Focus preservation** — input stays focused after every assistant message + action sequence. Visitor can keep typing without clicking back.

### Server

- **AI-visible state trace** — after every action, the LLM sees `[state]` block in the next prompt with URL diff + plain-English next-step instructions when the action was a no-op.
- **Knowledge-base ULTRA-HIGH priority** — every turn the LLM scans Site contacts (emails + phones), Page text excerpts (up to 2500 chars per page), Summary, Headings, Notes, and Sitemap before deciding an action.
- **Three-equal navigation paths** — `navigate`, `click`, `scroll_to` are now equally weighted in the decision tree. Bot picks based on situational fit, not hardcoded preference.
- **Cross-page anchor handling** — anchor links (`#contact`) only work on the page they live on; bot now navigates to `/pathname#anchor` for cross-page anchor targets.
- **Loop guards** — same-click 3x, same-navigate 2x, scroll-only 3x → break the loop with honest summary + clarifying question. Never silently emits "Done" when nothing happened.
- **Assistant message dedup** — server suppresses repeated assistant text against the most recent history entry. No more "Fahad ko hire karne ke liye…" × 3.
- **Crawler heartbeat reaper** — stale crawl jobs (no heartbeat for 60s) auto-marked failed. No more "scanning…" forever.
- **Contact extraction** — crawler scans all pages for emails + phone numbers; prepended as a `## Site contacts` block at the top of the LLM prompt.

### Dashboard

- **Dashboard redesign** — modernized cards, sticky sidebar with active-nav highlighting.
- **Live crawl panel** — real-time progress (pages discovered, walked, current URL).
- **Launcher + Nudge configurators** — full UI for all the per-site widget chrome.
- **Empty session cleanup** — dashboard hides + server stops writing empty sessions to DB.

## 2026-05-23

- **LeFlux Cloud MVP** shipped. Multi-tenant: users → orgs → sites. Per-site config (color, layout, allowed hosts), site crawler, embed.js zero-config loader.
- **Faster model pipeline** — sub-second first-token latency.

## 2026-05-15

- **Universal indexing** rolled out — agent now references elements by numeric id, not selectors. Works on any site without per-tenant rules.

## 2026-04-15

- **Iterative loop** — agent now takes multiple turns per visitor message. Tasks like form-fill complete autonomously.

## 2026-04-03

- **Initial public release** — basic chat widget. Server, widget bundle, embed.js loader.

---
