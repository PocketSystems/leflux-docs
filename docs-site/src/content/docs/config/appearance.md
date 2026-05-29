---
title: Appearance & layout
description: Color, layout mode, position, theme detection.
---

## Layout modes

Three options. Pick from **Settings → Appearance → Layout**.

### Floating bubble

Default. A round chat button in the corner. Click opens a panel above it. Chat-window is a corner card (`400 × 620px` on desktop, full-screen on mobile).

Best for: marketing sites, portfolios, content sites where the chat is a secondary affordance.

### Bottom-bar pill

Floating pill at the bottom-center of the viewport. Visible by default, with optional quick-chip suggestions above it. Clicking expands a panel above the pill.

Best for: e-commerce, landing pages, anywhere the chat is a primary engagement surface and you want maximum visibility.

### Side-panel drawer

Right-edge drawer, full viewport height. The host page gets `margin-right` so its content slides over to make room — like a real browser sidebar, not a floating cover.

Best for: docs sites, support portals, app interfaces where the chat is a continuous co-pilot.

You can switch layout per-site from the dashboard. The widget picks up the new layout on the next visitor session (no re-deploy needed).

## Primary color

Drives every accent in the widget — launcher, send button, focus rings, message-bubble brand color, kbd hints.

Three sources, in priority order:

1. **Admin override** (Settings → Appearance → Primary color). Wins everything.
2. **Crawler-detected** color (during the crawl, the worker samples the host page's palette and picks the dominant brand-feeling hue). Fills in when admin hasn't set one.
3. **Per-tenant brand color** auto-applied via site-config response.

If nothing's set anywhere the widget falls back to a safe teal — but in practice every active site has either an explicit override or a detected color.

## Greeting

The welcome text shown when the chat first opens. Default: `Hi! How can I help you navigate this site?`. Override per-site in Settings → Greeting.

Plain text. No HTML. Keep it under 80 characters for the cleanest look.

## Position

Where the floating launcher / bottom-bar sits. Options: `bottom-right` (default), `bottom-left`, `top-right`, `top-left`. Side-panel layout ignores this — it always docks to the right edge.

## Typography

The widget auto-inherits typography signals (heading font, body font, button-radius) detected during the crawl. The chat UI mirrors these so it looks "of" your site, not "on top of" it.

You can't override these from the dashboard — they're driven by the crawl. If you change your site's fonts, recrawl to pick up the new signals.

## Dark vs light

The widget picks its theme automatically in two passes:

1. First it reads the OS-level `prefers-color-scheme` media query. If the visitor's OS is set to dark mode, the widget renders dark.
2. If `prefers-color-scheme` is absent (rare), it falls back to sampling the host page's body background luminance — dark backgrounds (< 0.35 relative luminance) get a dark widget, lighter ones get a light widget.

There's no explicit dark/light toggle in the dashboard — the widget just follows the visitor's environment.

## Per-page customization

There isn't any. The widget is per-site, not per-page. If you need different configs on different pages, register multiple sites and gate the embed snippet by route in your template — that's the supported pattern.
