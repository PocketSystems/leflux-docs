---
title: REST endpoints
description: HTTP API exposed by the LeFlux server.
---

Base URL: `https://leflux.xrlabs.app/api` (or your self-hosted equivalent).

All endpoints accept + return JSON. CORS is open by default; restrict in nginx for production self-hosts.

## POST /api/session/init

Initialize a new visitor session. Called by `embed.js` on widget mount.

**Request**

```json
{
  "siteHost": "acme.com",
  "pageUrl": "https://acme.com/pricing"
}
```

Headers:

- `Origin: https://acme.com` — the only auth signal. The server matches this against every site's allowed-host list. There is no API token, no header secret, no `Authorization` header for the public widget API. Browsers prevent JS from forging cross-origin `Origin`, which makes it a sufficient signal for site identity.

**Response 200**

```json
{
  "sessionId": "uuid",
  "wsUrl": "wss://leflux.xrlabs.app",
  "siteConfig": {
    "layout": "floating",
    "primaryColor": "#a855f7",
    "greeting": "Hi! How can I help?",
    "position": "bottom-right",
    "typography": { "headingFont": "...", "bodyFont": "...", "buttonRadius": "8px" },
    "launcher": { "shape": "circle", "size": "md", "icon": "chat", "glow": true },
    "nudge": { "enabled": false },
    "quickChips": [{ "text": "Pricing", "payload": "Show pricing" }]
  }
}
```

**Response 403 — host not registered**

```json
{
  "error": "host_not_registered",
  "message": "Host \"x\" is not registered with LeFlux...",
  "host": "x",
  "signupUrl": "https://leflux.xrlabs.app/signup"
}
```

Rate limit: 10 requests per minute per IP.

## POST /api/chat

Send a visitor message. Asynchronous — response is `{messageId, status:"processing"}` and the actual reply streams over the WebSocket.

**Request**

```json
{
  "sessionId": "uuid",
  "message": "show me pricing",
  "pageContext": {
    "url": "https://acme.com/pricing",
    "title": "Pricing — Acme",
    "indexedElements": [
      { "id": 1, "type": "button", "text": "Get started", "parent": "Hero" }
    ],
    "visibleText": "Choose a plan...",
    "forms": [],
    "previouslyFilledFields": []
  }
}
```

Limits: `message` ≤ 5000 chars. `indexedElements` truncated server-side to 50.

**Response 200**

```json
{
  "messageId": "msg-1779723850877",
  "status": "processing"
}
```

The actual LLM reply + actions arrive on the WebSocket as `message_chunk` / `message_done` / `action_plan` events.

Rate limit: 30 requests per minute per session.

## GET /api/session/:id

Restore an existing session. Used on widget re-mount (page reload, tab reopen).

**Response 200**

```json
{
  "sessionId": "uuid",
  "exists": true,
  "host": "acme.com",
  "messageCount": 7,
  "siteConfig": {... same as session/init},
  "history": [
    { "role": "user",      "content": "show pricing" },
    { "role": "assistant", "content": "Here are the plans..." }
  ]
}
```

**Response 404** when the session was server-evicted (past 30min idle).

## DELETE /api/session/:id

Permanently delete a session. Used by visitors who want to clear their chat.

**Response 200** — `{ deleted: true }`.

## GET /api/stats

Server health + session stats. Public.

**Response**

```json
{
  "uptimeSeconds": 12345,
  "activeSessions": 47,
  "messagesProcessed": 89234,
  "version": "1.0.0"
}
```

## GET /health

Bare health check. Returns `{ status: "ok", timestamp: "..." }`. Used by nginx upstream health + GitHub Actions deploy verification.

## Errors

All errors follow a single shape:

```json
{
  "error": "machine_readable_code",
  "message": "human readable explanation",
  "details": { ... optional context ... }
}
```

Common codes:

| Code                      | HTTP | When                                                  |
|---------------------------|------|--------------------------------------------------------|
| `host_not_registered`     | 403  | Visitor's host not in allowed-host list.              |
| `session_not_found`       | 404  | Session expired or never existed.                     |
| `rate_limit_exceeded`     | 429  | Too many requests; back off.                          |
| `invalid_message`         | 400  | Validation failure (message too long, missing fields).|
| `internal_error`          | 500  | Unexpected server fault. Logged + investigated.       |

## Auth

Public endpoints (`session/init`, `chat`, `health`, `stats`) authenticate exclusively via the request `Origin` header against the allowed-host list. No token, no API key, no `Authorization` header required.

Dashboard endpoints (`/api/admin/*`) require Firebase Auth ID token in `Authorization: Bearer <jwt>` header — those manage the tenant config and DO need real auth. See [Self-hosting](/docs/advanced/self-hosting/) for full admin API details.
