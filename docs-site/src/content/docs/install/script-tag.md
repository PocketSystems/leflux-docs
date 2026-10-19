---
title: Script tag — works on any site
description: Install LeFlux on a plain HTML or static website with one async script, check allowed hosts, and verify the chat widget appears.
---

Use this script after you have added your site and its allowed hosts in the LeFlux dashboard. You can place it in plain HTML or in a site builder that supports custom scripts.

## The snippet

```html
<script src="https://leflux.ai/embed.js" async></script>
```

The HTML snippet does not contain a public token or API key. Your site's dashboard configuration is still required before the widget can load.

The browser sends an `Origin` header on the `/api/session/init` request. LeFlux checks it against the **Allowed hosts** list configured for your site. If the host has not been registered, the widget will not initialize.

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
<script src="https://leflux.ai/embed.js" async></script>
```

## Local development

Localhost installs work but you must add `localhost` (or whatever host you're testing) to one of your sites' allowed-host list. Easier alternative: set `data-preview="true"` to bypass server calls entirely and use widget defaults — useful for visual testing without registering a site.

```html
<script src="https://leflux.ai/embed.js" data-preview="true" async></script>
```

## Next platform

- [WordPress](/docs/install/wordpress/)
- [Shopify](/docs/install/shopify/)
- [Webflow / Framer](/docs/install/webflow-framer/)
- [React / Next.js](/docs/install/react-nextjs/)
- [Custom (Vue / Angular / Svelte / vanilla SPA)](/docs/install/custom/)
