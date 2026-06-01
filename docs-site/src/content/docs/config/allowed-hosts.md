---
title: Allowed hosts
description: The list of domains the widget is permitted to mount on.
---

The allowed-host list is what makes LeFlux secure without needing API tokens. On every `/api/session/init` request, the server reads the browser-attached `Origin` header (which JavaScript can't forge cross-origin) and looks up the site whose `allowedHosts` array contains that host. If no match, the request is rejected with `host_not_registered` and the embed script silently no-ops.

This is the entire security model. There's no API key, no token, no secret to manage — just a list of domains in your dashboard.

## Add hosts

The list is set when you create the site (the dashboard auto-stores the domain + `www.` form). To add additional hosts (staging subdomains, localhost for dev), email support at ishaquehassan@digitalhire.com. We can add them to your allowed-host list quickly.

A dashboard UI to add/remove hosts inline is on the roadmap. Check [the changelog](/docs/changelog/) for updates.

Sample stored array shape:

```json
["acme.com", "www.acme.com", "staging.acme.com", "localhost"]
```

Match rules:

- **Exact host match**, case-insensitive. The server stores both bare (`acme.com`) and `www.` prefixed (`www.acme.com`) forms automatically when you create a site, so both reach the same tenant.
- **Subdomain → apex fallback**. If `app.acme.com` requests and only `acme.com` is registered, the server strips the leading subdomain and tries the apex. So registering `acme.com` automatically covers EVERY subdomain on that apex.
- **No protocol**. Don't include `https://`. The host is the bare hostname.
- **No path**. Just the host. `acme.com/blog` is invalid; use `acme.com`.
- **Explicit wildcards** (`*.acme.com` syntax) — not supported. Use the subdomain → apex fallback instead, OR register specific subdomains individually for finer control.

## Common patterns

### Standard production + www redirect

```
acme.com
www.acme.com
```

(If your site server redirects `www` → apex, you usually still need `www.acme.com` here because the widget runs on the page BEFORE the redirect lands.)

### Staging + production

```
acme.com
www.acme.com
staging.acme.com
preview.acme.com
```

Wildcards aren't supported yet; either list each preview deploy host explicitly OR create a separate site for staging (with its own allowed-host list + crawl + analytics).

### Local development

```
localhost
127.0.0.1
192.168.x.x   (your LAN IP if testing on another device)
```

`localhost` is often safe to add to your prod site too — it doesn't open any real attack surface because no production traffic comes from there.

### Embedded in iframes / WebViews

```
acme.com
embed.partner-site.com   (if your widget runs inside a partner-hosted iframe)
```

Whatever the visitor's actual `window.location.host` reports is what you register here.

## Rejected requests

When a host isn't allowed, the server responds with:

```json
{
  "error": "host_not_registered",
  "message": "Host \"unknown.example\" is not registered with LeFlux. ...",
  "host": "unknown.example",
  "signupUrl": "https://leflux.ai/signup"
}
```

`embed.js` catches this and silently exits — no widget renders, no error visible to the visitor. Open DevTools → Network to see the rejection.

## Removing a domain

Deleting a host from the allowed-host list takes effect within ~15 seconds (the server-side host→site cache TTL). Existing live sessions stay connected over WebSocket — they don't disconnect retroactively. Re-deploy your site (with the embed snippet removed) to fully revoke.

## Why this matters

- Stops anyone from copy-pasting the embed snippet onto their own domain and burning your AI usage quota.
- Provides a clean audit trail of which domains use the widget.
- Lets you separate environments cleanly — each environment becomes a separate site in the dashboard with its own theme, crawl, allowed-host list.

## Why no API token

The widget runs entirely in the visitor's browser. Any token embedded in the snippet would be public (anyone viewing source can read it), so it'd add no real security — just config friction. The `Origin` header is browser-enforced + immutable from JS, which makes it a better authentication signal than a public token. Server-to-server abuse can forge either, so neither helps there.

We accept a legacy `apiKey` request parameter for backwards compatibility with older embeds but it's not required and not documented — new integrations should rely on `Origin` + allowed-host list alone.
