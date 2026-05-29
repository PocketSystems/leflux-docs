---
title: Smooth-scroll libraries (Lenis, GSAP)
description: When your site's smooth scroll hijacks the widget's scroll.
---

Lenis, GSAP ScrollSmoother, locomotive-scroll — all override native wheel scroll at the document level. By default they hijack EVERY wheel event, including those inside the chat panel. Visitor wheel-scrolls inside the chat → host page scrolls instead of the chat.

LeFlux handles this automatically in most cases. When it doesn't, here's how to debug + fix.

## What the widget does

On mount, the widget:

1. Adds `data-lenis-prevent`, `data-lenis-prevent-wheel`, `data-lenis-prevent-touch` to its shadow host. Lenis 1.x respects these attributes and skips its hijack for events whose target is inside the marked subtree.
2. Adds a `wheel` listener at the WINDOW with capture phase that calls `stopPropagation` when the event originates inside the shadow root. This stops Lenis (and any other window-level hijack) from advancing host scroll for events that should land on the chat.

## When it still breaks

If your smooth-scroll library:

- Is older than Lenis 1.0 (doesn't check `data-lenis-prevent`)
- Listens with `passive: false` and prevents default itself before our `stopPropagation` lands
- Uses a custom wheel-to-scroll driver that bypasses standard events

…then the widget's default isolation isn't enough.

## Fix 1 — Tell the library to skip the widget

Most smooth-scroll libs have an "exclude" config. Add the widget's shadow host:

```js
// Lenis 1.x
const lenis = new Lenis({
  prevent: (node) => node.closest && node.closest('#ai-chat-widget-container'),
});

// locomotive-scroll
const scroll = new LocomotiveScroll({
  multiplier: 1,
  // locomotive doesn't have first-class shadow DOM skip; use this CSS:
});
```

For locomotive (no JS escape hatch), use the CSS approach below.

## Fix 2 — CSS overscroll-behavior

Force the chat-messages list to fully contain its scroll:

```js
window.addEventListener('leflux:ready', () => {
  const host = document.getElementById('ai-chat-widget-container');
  const style = document.createElement('style');
  style.textContent = `
    .chat-messages {
      overscroll-behavior: contain !important;
      -webkit-overflow-scrolling: touch !important;
    }
  `;
  host.shadowRoot.appendChild(style);
});
```

This stops scroll from chaining to the host page when the messages list hits its top / bottom boundaries. Already on by default in the widget; you can re-apply with `!important` if your smooth-scroll lib's CSS is overriding it.

## Fix 3 — Disable smooth scroll when chat is docked

A nuclear option for the side-panel layout: when the chat is docked, fully disable Lenis so the visitor's wheel ONLY scrolls the chat.

```js
window.addEventListener('leflux:open', () => { window.lenis?.stop(); });
window.addEventListener('leflux:close', () => { window.lenis?.start(); });
```

Requires that you exposed your Lenis instance on `window.lenis`. Adjust the path for your setup.

## Fix 4 — Lock body scroll when chat is docked

Even more aggressive. While the chat is docked, set `position: fixed` on the body so there's no scrollable area for Lenis to advance:

```js
window.addEventListener('leflux:dock', () => {
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${window.scrollY}px`;
});
window.addEventListener('leflux:undock', () => {
  const y = parseInt(document.body.style.top || '0') * -1;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, y);
});
```

(The widget's `_applyHostSidebarSpacing` used to do this internally; we removed it because some hosts had stale-lock issues. You can opt-in via this snippet.)

## Touch-only smooth scroll

iOS Safari has its own momentum scroll separate from Lenis. The widget's `-webkit-overflow-scrolling: touch` already enables momentum inside the chat. If touch scroll inside the panel feels weird, check:

- Your CSS isn't setting `-webkit-overflow-scrolling: auto` globally.
- Your `<meta name="viewport">` includes `viewport-fit=cover` if you use `safe-area-inset-*`.

## Verifying the fix

Open DevTools console:

```js
// Should be true on a fresh widget mount:
document.getElementById('ai-chat-widget-container').hasAttribute('data-lenis-prevent');

// While scrolling inside the chat, watch:
//   - window.scrollY should NOT change
//   - chatMessages.scrollTop should change
const host = document.getElementById('ai-chat-widget-container');
const msgs = host.shadowRoot.getElementById('chat-messages');
setInterval(() => console.log('body:', window.scrollY, 'chat:', msgs.scrollTop), 200);
```

Wheel inside the chat. If body advances, the isolation broke — try Fix 1 or 3 above.

## Tested with

| Library                  | Version  | Works out of the box?                              |
|--------------------------|----------|----------------------------------------------------|
| Lenis                    | 1.0+     | Yes (via `data-lenis-prevent`).                    |
| Lenis                    | <1.0     | Needs Fix 1 (prevent function).                    |
| GSAP ScrollSmoother      | 3.11+    | Yes (via stopPropagation isolation).               |
| locomotive-scroll        | 4.x      | Needs Fix 2 (CSS overscroll-behavior).             |
| `framer-motion` scroll   | any      | Yes.                                                |
| Native CSS smooth scroll | n/a      | Yes (browser handles it correctly).                |
