---
title: Script tag — works on any site
description: One-line install. Plain HTML, static sites, anything with a <script> tag.
---

The universal install. Copy one tag into your HTML and you're done.

## The snippet

```html
<script src="https://leflux.xrlabs.app/embed.js" async></script>
```

That's it. No tokens, no keys, no configuration.

Why this works without a token: browsers won't let JavaScript forge a cross-origin `Origin` header. The LeFlux server reads `Origin` on the `/api/session/init` call and matches it against the **Allowed hosts** list you configure in the dashboard. Tokens in embed snippets are public anyway (anyone viewing source can see them) so they'd add no real security — `Origin` does the same job with zero-config UX.

The `async` attribute is recommended so the script loads without blocking your page render.

## Where to paste it

| HTML location              | When to pick                                                                        |
|----------------------------|--------------------------------------------------------------------------------------|
| `<head>`                  | Earliest mount. Widget UI may flash a tiny moment before CSS settles, but actions can fire on `load`. |
| Right before `</body>`    | Default and safest. Loads after content, no flash, no render-blocking impact.       |

## What `embed.js` does

When the script runs in the visitor's browser it:

1. Auto-detects host + page URL from `window.location`.
2. Calls `POST /api/session/init` against the LeFlux API. The browser attaches an `Origin` header automatically — the server uses that to identify which tenant site this request belongs to.
3. Server looks up the site whose `allowedHosts` contains the request origin, returns the `siteConfig` (layout, primary color, greeting, launcher, nudge).
4. Loads the main widget bundle (`leflux-agent.js`) and mounts it inside a shadow root.
5. Opens a WebSocket for streaming AI responses + action dispatch.

If the origin isn't in any site's allowed-host list, the API rejects the init and `embed.js` silently no-ops — nothing renders. This is the security model: only your registered domains can run the widget.

## Verifying it works

After paste + reload:

1. Open the browser console. You should see `✅ AI Chat Widget initialized`.
2. The launcher button appears in the corner you chose (default bottom-right).
3. Click the launcher — the chat opens.

If nothing happens, see [Troubleshooting → Widget not loading](/docs/troubleshoot/not-loading/).

## Multiple environments

You probably want separate sites for staging + production so test traffic doesn't pollute your live knowledge base. Create two sites in the dashboard, one per domain (`staging.acme.com`, `acme.com`). Each domain has its own allowed-host list, theme, and crawled knowledge base — the SAME embed snippet works on both, because the server identifies the tenant from the request `Origin`.

```html
<!-- Same snippet on every environment. The server routes traffic
     to the correct tenant based on Origin. -->
<script src="https://leflux.xrlabs.app/embed.js" async></script>
```

## Local development

Localhost installs work but you must add `localhost` (or whatever host you're testing) to one of your sites' allowed-host list. Easier alternative: set `data-preview="true"` to bypass server calls entirely and use widget defaults — useful for visual testing without registering a site.

```html
<script src="https://leflux.xrlabs.app/embed.js" data-preview="true" async></script>
```

## Next platform

- [WordPress](/docs/install/wordpress/)
- [Shopify](/docs/install/shopify/)
- [Webflow / Framer](/docs/install/webflow-framer/)
- [React / Next.js](/docs/install/react-nextjs/)
- [Custom (Vue / Angular / Svelte / vanilla SPA)](/docs/install/custom/)
