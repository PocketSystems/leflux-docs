---
title: Custom themes
description: When dashboard config isn't enough.
---

Dashboard config covers ~95% of theming needs (primary color, layout, fonts auto-detected, launcher shape/size, nudge styles). For the remaining 5% — custom logo SVGs, bespoke CSS, custom block renderers — you have two escape hatches.

## CSS overrides via shadow root

The widget renders inside a shadow root, so host-site CSS doesn't leak in (intentional — that's the whole point of shadow DOM). But you can inject CSS into the shadow root after mount:

```js
window.addEventListener('leflux:ready', () => {
  const host = document.getElementById('ai-chat-widget-container');
  const style = document.createElement('style');
  style.textContent = `
    /* Round the launcher even more */
    .chat-button { border-radius: 4px !important; }
    /* Custom font for the chat header */
    .chat-header { font-family: 'Your Custom Font', serif !important; }
  `;
  host.shadowRoot.appendChild(style);
});
```

`!important` is needed because the widget's own CSS already has high specificity. Keep overrides minimal — they're maintenance debt.

## Custom CSS variables

The widget exposes a few CSS variables on its shadow host you can override from the host page:

| Variable                       | What it controls                                |
|--------------------------------|--------------------------------------------------|
| `--leflux-primary`             | Brand accent color                              |
| `--leflux-bg`                  | Chat-window background                          |
| `--leflux-messages-bg`         | Messages-list background (slightly darker)      |
| `--leflux-input-bg`            | Input pill background                           |
| `--leflux-input-border`        | Input pill border color                         |
| `--leflux-text-primary`        | Body text color                                 |
| `--leflux-text-secondary`      | Subtitle / status text color                    |
| `--leflux-border`              | Generic border color                            |

Override on the host element (NOT inside the shadow root — the var inherits from the host):

```css
#ai-chat-widget-container {
  --leflux-primary: #00d4ff !important;
}
```

This is the cleanest way to do custom branding without writing widget CSS overrides.

## Custom logo

Dashboard → Branding → Logo URL accepts any public image URL. PNG, SVG, JPEG. Square aspect ratio recommended (1:1, ideally ≥64px).

For SVG that needs to follow your theme color: use `currentColor` for fill/stroke and the widget will tint it primary automatically (advanced — make sure your SVG doesn't have explicit color values).

## Custom UI block renderers

The widget exposes a renderer registry on `window.__lefluxBlockRenderers`. You can register a custom renderer at runtime:

```js
window.__lefluxBlockRenderers['my_custom_type'] = (data, shadow) => {
  const el = document.createElement('div');
  el.className = 'message assistant ui-block';
  el.innerHTML = `<div class="message-content">Custom: ${JSON.stringify(data)}</div>`;
  return el;
};
```

For custom block types to work end-to-end, the server-side model prompt template needs to know they exist. To add a new block type, email support at ishaquehassan@digitalhire.com to coordinate with the LeFlux team.

## Custom launcher icon

If the built-in icon set (chat / sparkle / question / lightning / cursor) doesn't fit, you can override the launcher's SVG via the CSS-injection method above:

```js
const button = host.shadowRoot.querySelector('.chat-button-icon');
button.innerHTML = '<path d="..." stroke="currentColor" stroke-width="2"/>';
```

Future: dashboard-configurable custom icons are on the roadmap.

## Dark / light forcing

The widget auto-detects theme from `prefers-color-scheme` (or body background luminance as fallback). To force one explicitly, override the brand CSS variables via host-side CSS:

```css
#ai-chat-widget-container {
  --leflux-bg: #1a1a1f;
  --leflux-messages-bg: #15151a;
  --leflux-text-primary: #f1f5f9;
  --leflux-text-secondary: #9ca3af;
  --leflux-input-bg: #15151a;
  --leflux-input-border: rgba(168, 85, 247, 0.35);
}
```

There is no `color-scheme` runtime check inside the widget — the detection happens once at mount via `window.matchMedia('(prefers-color-scheme: dark)')`. Forcing the visitor's OS theme isn't possible from CSS; overriding the brand variables is.

## When NOT to customize

If you find yourself writing more than ~30 lines of CSS overrides, you're probably fighting the widget. Re-check the dashboard — there's usually a config knob for what you need. Custom CSS is fragile across widget updates; dashboard config is version-safe.
