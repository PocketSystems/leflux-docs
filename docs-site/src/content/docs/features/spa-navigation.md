---
title: SPA navigation
description: How LeFlux survives client-side route changes.
---

LeFlux runs in the visitor's browser as a single long-lived instance. When a Single-Page Application (Next.js, React Router, Vue Router, SvelteKit, Solid) changes routes client-side, the widget needs to:

1. Detect the route change.
2. Re-index the new page's interactive elements.
3. Re-establish page context.
4. Preserve conversation history.

All four happen automatically.

## Detection

The widget patches `history.pushState` + `history.replaceState` to emit synthetic `leflux:locationchange` events, and listens for native `popstate`. Any of these triggers the route-change pipeline:

```
SPA navigation
   ↓
window.location.href changed
   ↓
emit 'leflux:locationchange'
   ↓
debounce 200ms (wait for the new route's render to settle)
   ↓
re-index interactive elements
   ↓
update session.lastObservedUrl
   ↓
ready for next visitor turn
```

The 200ms debounce is critical — most SPAs re-render in a few frames, so indexing immediately would miss the new content.

## What's preserved

- Conversation history (visitor + assistant messages)
- Current chat-open / docked state
- Current visitor session id (long-lived)
- localStorage caches: user-data-store, persisted state, dismissal flags

## What changes

- `indexedElements` array (re-built for the new route)
- Page context (URL, title, visibleText)
- Auto-config theme samples (re-sampled if it's a redesigned page)

## Detected frameworks

The widget auto-detects: Next.js, React Router, Vue Router, SvelteKit, Solid Router, Astro view transitions. Detection is informational — the actual routing handler is universal (`history.pushState` + `popstate`). Auto-detect just lets us log a friendly tag.

## How agent navigation interacts

When the agent emits `navigate`, the widget:

1. Calls `history.pushState` with the new URL (no page reload).
2. Dispatches a `popstate` event so the host SPA's router picks it up.
3. The SPA renders the new route.
4. The route-change pipeline fires, indexer re-scans.
5. Next iteration's context has the new URL + indexed elements.

This means the widget cooperates with your SPA router instead of fighting it. Visitor's client state (logged-in session, in-flight form data on other pages, Redux/Zustand store) survives the navigation.

## When it falls back to a full reload

Three cases trigger a real `window.location.href` assignment:

1. Cross-origin navigate (security — pushState refuses cross-origin URLs).
2. The SPA doesn't have a router (plain HTML site with `<a href>` links).
3. The host page sends a `leflux:disable-spa` event (escape hatch for hosts that don't want client-side route changes from the widget).

In those cases the page hard-reloads, session state restored from localStorage on the new page's widget mount.

## Smooth-scroll libraries

Lenis, GSAP ScrollSmoother, locomotive-scroll — all override native wheel scroll. The widget detects these and:

- Adds `data-lenis-prevent` to its shadow host so Lenis skips wheel hijack inside the panel.
- Uses `event.stopPropagation` at window-capture for wheel events targeting the shadow root.

Scroll inside the chat panel stays inside the panel; host page scroll continues as normal everywhere else. See [Smooth-scroll troubleshooting](/docs/troubleshoot/smooth-scroll/).

## React strict mode

In dev, React strict mode double-mounts components. The widget handles this — the second mount detects the existing instance and skips re-initialization. No duplicate launcher.

## Astro view transitions

When the host uses Astro's `<ViewTransitions />`, the widget's shadow root persists across page transitions (we add `transition:persist` semantics via a custom listener). Conversation survives the transition.
