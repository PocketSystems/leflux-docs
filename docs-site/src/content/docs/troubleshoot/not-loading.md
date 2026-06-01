---
title: Widget not loading
description: First-aid checklist when the launcher doesn't appear.
---

You pasted the snippet, reloaded, nothing shows up. Walk through these in order.

## 1. Is the script actually loaded?

Open DevTools → Network → filter `leflux`. You should see two requests:

- `embed.js` (small, ~5 KB) — first thing to land.
- `leflux-agent.js` (~150 KB gzipped) — main bundle.

Missing both → script tag isn't in your HTML. Check view-source, confirm the `<script src="...embed.js">` actually rendered to the page.

Missing only `leflux-agent.js` → the site init was rejected. Most common cause: this host isn't in any site's allowed-host list. Add it in **Dashboard → Settings → Allowed hosts**.

## 2. Open the console

Look for `[LeFlux]` log lines.

- `[LeFlux] preview mode — server calls disabled` → you set `data-preview="true"` on the script tag (only expected in dev / visual-testing scenarios).
- `✅ AI Chat Widget initialized` → widget mounted successfully. If the launcher still isn't visible, jump to step 4.
- `host_not_registered` → your domain isn't in the site's allowed-host list. Open the dashboard, add the host (the EXACT string from `window.location.host`), save.

## 3. Console errors

Look for red errors. Common ones:

- `Failed to fetch https://leflux.ai/api/session/init` → network firewall blocking the API. Whitelist `leflux.ai` in your proxy config.
- `CSP violation: refused to load <script>` → your Content Security Policy blocks the widget. See [Security model → CSP](/docs/advanced/security/#csp-compatibility).
- `Uncaught (in promise) TypeError` originating from `leflux-agent.js` → email support at ishaquehassan@digitalhire.com with the full stack trace.

## 4. Launcher is rendered but invisible

Open DevTools → Elements → search for `ai-chat-widget-container`. Found?

If yes — the widget mounted but CSS is hiding it. Likely causes:

- Host site CSS sets `* { display: none !important }` (rare; some print stylesheets). Inspect computed styles on the container.
- A parent has `transform` / `filter` that creates a containing block, breaking the widget's fixed-position calc. Try `display: contents` on intermediate wrappers.
- The launcher's z-index conflicts with a host-site sticky element with z-index > 2147483645. Bump the host's element down.

## 5. Wrong host in allowed list

The widget validates the EXACT `window.location.host`. Some pitfalls:

- `www.acme.com` ≠ `acme.com`. Add both if you support both.
- Ports matter: `acme.com:3000` ≠ `acme.com`.
- Subdomains: `app.acme.com` ≠ `acme.com`. Add each subdomain explicitly.
- IPs: if you're testing via IP (`192.168.x.x`), add the IP to allowed hosts.

## 6. Cache

The browser may have cached a previous failed init. Force-reload:

- Chrome / Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac).
- Or DevTools → Network tab → check "Disable cache" → reload.

Servers may also cache the embed snippet itself if you use a CDN. Purge `/embed.js` from CDN if you recently updated.

## 7. Multiple snippets

If you pasted the snippet twice (e.g. once in header, once in footer), the widget detects the duplicate and second instance silently no-ops. Open DevTools → Elements → search `ai-chat-widget-container` — there should be exactly ONE. If two, remove one of the snippets.

## 8. Mobile-only

Check if the widget appears on desktop but not mobile (or vice versa). Causes:

- Mobile viewport too small + chat-window minimum height conflicts with safe-area insets. Open Settings → Appearance → Position and try a different corner.
- Mobile browser blocks third-party JS (rare; some "data saver" modes). Test in regular mode.

## 9. Still broken

Email support at ishaquehassan@digitalhire.com with:

- Your domain
- Browser + version
- Console output (full)
- Network tab screenshot showing the two requests' status codes
- A view-source of the page showing the embed snippet

We respond within 24h.
