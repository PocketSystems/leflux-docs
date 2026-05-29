---
title: Conflicts with host CSS
description: When the widget breaks your site's layout, or vice versa.
---

LeFlux runs in a shadow root specifically so CSS doesn't leak in either direction. In practice the isolation is ~99% solid; here are the 1% gotchas.

## Host site CSS leaking INTO the widget

Shadow DOM blocks all CSS by default. The only things that cross the boundary are:

- **Inherited CSS properties** — `color`, `font-family`, `line-height`, etc inherit from the host element.
- **CSS custom properties** — `--leflux-primary` and friends inherit from the host.
- **The `:host()` selector** — CSS targeting `ai-chat-widget-container` from the outside works.

If your widget text looks wrong:

```css
/* Reset inherited typography at the widget host */
ai-chat-widget,
#ai-chat-widget-container {
  font-family: initial;
  color: initial;
  line-height: initial;
}
```

(Most sites don't need this; it's a last resort.)

## Widget CSS leaking OUT to host

Doesn't happen. Widget styles are scoped to its shadow root. If you see widget styles affecting your site, something else is going on.

## Z-index conflicts

The widget uses `z-index: 2147483646` (one less than max-int) so it sits on top of basically anything. If a host element with `z-index: 2147483647` exists, it can occlude the widget. Lower that element's z-index or accept that the widget will be hidden under it.

## Position / transform on ancestors

The widget's chat-window uses `position: fixed` to attach to the viewport. If any ancestor of `#ai-chat-widget-container` has `transform` / `filter` / `will-change: transform` / `contain: paint`, those create a NEW containing block for fixed descendants — the widget will pin to the ANCESTOR'S bounds instead of the viewport.

Check ancestor styles:

```js
const host = document.getElementById('ai-chat-widget-container');
let n = host.parentElement;
while (n) {
  const cs = getComputedStyle(n);
  if (cs.transform !== 'none' || cs.filter !== 'none' || cs.willChange !== 'auto') {
    console.warn('containing block trap:', n);
  }
  n = n.parentElement;
}
```

Fix: move `#ai-chat-widget-container` to be a direct child of `<body>`. Either:

1. Reposition the script tag so embed.js mounts directly under body.
2. Or use JS after mount: `document.body.appendChild(document.getElementById('ai-chat-widget-container'))`.

## Host scroll vs widget scroll

The widget's messages list has its own scroll context. Scrolling inside the panel should NOT scroll the host page. If you see host page scrolling when you wheel inside the chat:

- A smooth-scroll library (Lenis, ScrollSmoother) is hijacking wheel events. See [Smooth-scroll troubleshooting](/docs/troubleshoot/smooth-scroll/).
- Or your host page CSS sets `overscroll-behavior: contain` on a parent that breaks the widget's own contain rule. Unset it.

## Cookie banners / GDPR overlays

These typically use `position: fixed; z-index: 99999`. Lower than the widget's max-int z-index, so the widget renders ON TOP of them. Some banners block clicks site-wide via a backdrop — the widget's actions can still fire (they bypass coordinate hit-testing) but visitors might see the banner covering the widget visually.

Fix: hide the cookie banner while the widget chat is open, or vice versa, via your banner library's API.

## Print stylesheets

Some sites set `@media print { * { display: none } }` to hide everything but the article body. The widget gets hidden too — usually fine, since visitors rarely print mid-chat.

If you want to keep the widget visible in print previews:

```css
@media print {
  #ai-chat-widget-container { display: block !important; }
}
```

## SVG / icon font conflicts

The widget bundles its own SVG icons inline. Doesn't depend on FontAwesome / Material Icons / etc. Your icon font shouldn't affect the widget, but if your CSS injects icon fonts globally via `@font-face` it can paint emoji-like artifacts on the widget's text. Scope your `@font-face` declarations to specific selectors.

## Touch events on mobile

If you have a swipe-to-dismiss library on the body, it may interfere with the widget's touch handling. The widget calls `stopPropagation` on touchmove inside the chat panel; if your library also captures at the root and ignores propagation, conflicts arise. Most modern swipe libs (swiper.js, hammer.js) cooperate fine.
