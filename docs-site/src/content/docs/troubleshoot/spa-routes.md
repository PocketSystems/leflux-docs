---
title: SPA route changes
description: When the widget doesn't pick up your client-side navigation.
---

LeFlux is SPA-aware out of the box. When your React Router / Next.js / Vue Router app changes routes, the widget detects it, re-indexes the new page, and continues the conversation. If this isn't happening, here's how to fix it.

## How detection works

The widget patches `history.pushState` and `history.replaceState` to emit synthetic `leflux:locationchange` events, and listens for native `popstate`. Any of these triggers the route-change pipeline.

Verify the patches are installed:

```js
// In DevTools console after the widget mounts:
history.pushState.toString();
// Should contain "leflux:locationchange" — confirms our patch is in place.
```

If the function doesn't mention `leflux:locationchange`, the patch was prevented (see "Patch was prevented" below).

## Common failures

### Route changes via `window.location.assign` / `window.location.href`

These are HARD navigations — full page reload, new HTML. Not SPA route changes. The widget remounts on the new page (with persisted session state), so there's nothing to "detect" — it's a fresh mount.

If your "SPA navigation" turns out to be `window.location.href = '/new'`, that's why the widget seems to re-init.

### Custom router that doesn't use History API

Some old routers (Backbone, pre-Vue 2) use hash-based routing (`#/page1`, `#/page2`). The widget listens for `hashchange` too, so this works fine for those.

If your custom router bypasses History API AND hashchange, you'll need to manually dispatch:

```js
window.dispatchEvent(new CustomEvent('leflux:locationchange'));
```

…after your router finishes its route change.

### Patch was prevented

Some host pages defensively re-override `history.pushState` after our patch. If your site does this (rare, usually only analytics SDKs), our event won't fire.

Fix: in your site's code, after your override:

```js
const _ourPushState = history.pushState;
history.pushState = function(...args) {
  _ourPushState.apply(this, args);
  // re-dispatch so any listeners (incl. LeFlux) pick it up
  window.dispatchEvent(new CustomEvent('leflux:locationchange'));
};
```

Or just dispatch the event after every route change in your app code.

### Route change too fast / too slow

The widget debounces re-indexing by 200ms after a route change to let the new route's render settle. If your route renders take longer than 200ms, the indexer captures the LOADING state, not the final state. Visitor's next message uses the wrong indexed elements.

Fix: increase the debounce. Currently not configurable from outside — file an issue if you need this; we can add a `data-spa-debounce` attribute on the embed snippet.

### Astro view transitions

Astro's `<ViewTransitions />` swaps page content via the View Transitions API. The widget's shadow root persists across the swap (we hook into Astro's transition lifecycle). If you see a brief widget flicker mid-transition, that's the host page's transition animation; nothing's broken.

## Manual re-index

Force a re-index from outside the widget:

```js
window.LeFlux?.reindex();
```

(Available since widget release 2026-05-25. Earlier builds need to dispatch the locationchange event manually as above.)

## Verifying

After a route change:

```js
const host = document.getElementById('ai-chat-widget-container');
// indexedElements should reflect the new page:
host.shadowRoot.host.dataset.lastRoute === window.location.pathname; // true after re-index
```

Or send a message to the agent and check that its action references elements on the new page, not the old one.

## What persists across routes

- Conversation history (messages)
- Open/docked state
- localStorage user-data-store
- Session ID
- WebSocket connection

What changes:

- `indexedElements`
- `visibleText`
- Page URL + title
- Auto-config theme samples (only if you've re-saved color in settings)

## Multiple SPA frameworks on the same page

If you have a Next.js app that embeds a React Router micro-app inside an iframe, the iframe is a separate browsing context — the widget mounted on the outer Next.js app doesn't see the iframe's route changes. Mount a SEPARATE widget instance inside the iframe with the same site token if you need it there.
