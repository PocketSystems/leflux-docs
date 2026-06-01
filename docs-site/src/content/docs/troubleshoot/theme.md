---
title: Theme / color issues
description: When the widget's colors don't match what you configured.
---

The most common report: "I set the primary color to blue but the widget is still teal". Here's the priority chain + how to debug it.

## Priority chain

Three sources, highest wins:

1. **Admin override** (Dashboard → Settings → Appearance → Primary color). Wins everything.
2. **Crawler-detected color** (auto-sampled from your live site during crawl).
3. **Per-tenant default** (rare — set during onboarding by support).

If all three are unset, the widget falls back to a safe teal (`#0d9488`) as a last-resort safety so CSS never gets an invalid `--leflux-primary` value.

## Debugging

### Is the override actually saved?

1. Dashboard → Settings → Appearance.
2. Check the Primary color value field. Confirm it's the color you expect.
3. Save again.
4. Verify via the API: `GET /api/session/init` response should have `siteConfig.primaryColor` matching.

If the value isn't saved, it's a dashboard issue — check console for save errors.

### Is the value being received by the widget?

In DevTools console on your site:

```js
fetch('https://leflux.ai/api/session/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ siteHost: location.host, pageUrl: location.href })
}).then(r => r.json()).then(d => console.log(d.siteConfig));
```

Inspect `primaryColor` in the response. If it's null / wrong, the issue is server-side.

### Is the widget applying the value?

In DevTools, inspect the widget's shadow host:

```js
const host = document.getElementById('ai-chat-widget-container');
getComputedStyle(host).getPropertyValue('--leflux-primary');
```

This should return your hex value. If it returns the safe teal default, the value got dropped — most likely because it failed CSS-color validation (e.g. it was the string `"null"` from a bad save).

### Is the value being overridden by host site CSS?

The widget is in a shadow root so host CSS shouldn't leak. But `--leflux-primary` is a CSS variable inherited from the host element — if you set it on `#ai-chat-widget-container` (via host CSS) it WILL override.

Check host CSS for any rule targeting `#ai-chat-widget-container` or `ai-chat-widget` — that takes priority by design.

## Color not detecting on crawl

The crawler samples the host page's palette and picks the dominant brand-feeling hue. If the auto-detected color is wrong:

- Your site has too much grey / black chrome (logo + dark sections dominate the palette).
- Your accent color is too low-saturation or too rare in the rendered page.

Fix: just set the admin override in the dashboard. It wins regardless.

## Theme dark / light auto-detect mismatched

The widget reads the host page's `body` background-color brightness and picks dark vs light theme. If your site has a near-white background it picks light; near-black it picks dark.

To force one:

```css
#ai-chat-widget-container { color-scheme: dark; }
```

Set this on the host page CSS — the widget reads `color-scheme` on its container.

## Inline `style` attribute on the host

If your site dynamically sets inline styles on `#ai-chat-widget-container` (some site templates do this), those override the widget's own styles. Usually unintentional — check your site code for any rule that targets the container's `style` attribute and remove it.

## After-deploy stale theme

After saving theme changes in the dashboard, the widget pulls the new config on the NEXT `/api/session/init` call. Visitors with an in-flight session keep the old theme until they reload.

To force-refresh: hard-reload the page (Ctrl+Shift+R). The init call gets fresh config.

## Per-page color overrides

Not supported. The widget is per-site, not per-page. If you genuinely need different colors on different sub-paths, register multiple sites and gate the embed snippet by route.
