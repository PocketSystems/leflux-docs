---
title: Launcher button
description: Shape, size, icon, position offset, glow.
---

The launcher is the button visitors tap to open the chat. Configure it in **Settings → Launcher** in the dashboard.

## Hide launcher

The very first toggle in the picker. Turn ON when you want to **mount the chat but not show the floating button** — useful when your site has its own "Need help?" CTA and you want THAT to be the entry point. The widget still mounts and connects in the background; only the FAB is invisible.

Open the chat from your own UI:

```js
document.querySelector('.your-help-button').addEventListener('click', () => {
  window.LeFlux.open();
});
```

See the [Programmatic API](/docs/advanced/programmatic-api/) reference for the full surface.

The hidden setting persists per-site. For a one-off per-page override (e.g. hide the launcher only on `/checkout`) call `window.LeFlux.showLauncher(false)` after the `leflux:ready` event — it flips the FAB visibility without changing the saved dashboard setting.

## Shape

| Option       | Preview behavior                                                      |
|--------------|-----------------------------------------------------------------------|
| Circle       | Default. Perfect circle, primary-color fill, soft halo.               |
| Squircle     | Rounded square with iOS-style corner curve (~30% radius).             |
| Pill         | Horizontal pill, room for an icon AND a short label.                  |

## Size

| Option | Pixels       | When to pick                              |
|--------|--------------|-------------------------------------------|
| Small  | 44 × 44      | Minimal footprint, dense layouts.         |
| Medium | 56 × 56      | Default. Standard chat-button size.       |
| Large  | 64 × 64      | High-engagement landing pages.            |

## Icon

Pick the SVG that ships on the launcher. Built-in options:

- **Chat bubble** (default)
- **Sparkle** — implies AI / magic
- **Question mark** — implies help / support
- **Lightning** — implies fast / instant
- **Cursor pointer** — implies interactive guide

Custom SVGs aren't supported from the dashboard yet — they're on the roadmap. If you need a custom icon today, see [Custom themes](/docs/advanced/themes/).

## Position

The launcher's corner. Same options as the global position setting (`bottom-right` / `bottom-left` / `top-right` / `top-left`). The launcher config inherits the global position by default; you can override per-launcher.

## Offset

Pixel padding from the chosen corner. Defaults `(24, 24)`. Useful when your site has its own bottom-fixed chrome (cookie banner, sticky CTA bar) that would visually collide with the launcher — bump the offset to clear it.

## Glow

Boolean toggle. When on, the launcher has a soft primary-color halo that pulses slowly to draw the eye. Default: on. Turn off for a minimal-aesthetic site.

## Live preview

The dashboard's launcher picker has a live mini-preview to the right of every option. Click around — no save needed until you're happy.

## What gets sent to the widget

The launcher config lands in the per-site config as:

```json
{
  "launcher": {
    "hidden": false,
    "shape": "circle",
    "size": "md",
    "icon": "chat",
    "position": "bottom-right",
    "offsetX": 24,
    "offsetY": 24,
    "glow": true
  }
}
```

Override fields individually — anything you don't set inherits the widget defaults.
