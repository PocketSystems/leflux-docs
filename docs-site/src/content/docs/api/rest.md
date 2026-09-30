---
title: REST endpoints
description: HTTP API exposed by the LeFlux server.
---

Base URL: `https://leflux.ai/api`.

All endpoints accept and return JSON. Requests are validated against your site's allowed-host list.

## POST /api/session/init

Initialize a new visitor session. Called by `embed.js` on widget mount.

**Request**

```json
{
  "websiteUrl": "https://example.test/pricing",
  "config": {}
}
```

Headers:

- `Origin: https://acme.com` — the only auth signal. The server matches this against every site's allowed-host list. There is no API token, no header secret, no `Authorization` header for the public widget API. Browsers prevent JS from forging cross-origin `Origin`, which makes it a sufficient signal for site identity.

**Response 200**

```json
{
  "sessionId": "uuid",
  "wsUrl": "wss://leflux.ai",
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
  "signupUrl": "https://leflux.ai/signup"
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
  "context": {
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

Limit: `message` ≤ 5000 characters. Send the widget’s current page context with each turn; element ids can change after rescanning.

**Response 200**

```json
{
  "messageId": "msg-1779723850877",
  "status": "processing"
}
```

The actual LLM reply + actions arrive on the WebSocket as `message_chunk` / `message_done` / `action_plan` events.

Rate limit: 30 requests per minute per IP, with an additional per-session LLM token bucket.

## GET /api/session/:id

Restore an existing session. Used on widget re-mount (page reload, tab reopen).

**Response 200**

```json
{
  "sessionId": "uuid",
  "createdAt": 1779723850877,
  "lastActivity": 1779723850877,
  "messageCount": 7,
  "siteConfig": { "layout": "floating" }
}
```

`siteConfig` uses the same shape as initialization and may be omitted in legacy mode. History is delivered on socket join or through the messages endpoint, not this metadata response.

On a memory miss, the server attempts same-site Firestore recovery for state saved within 24 hours. **404** means no accessible recoverable session; malformed ids return **400**.

## GET /api/session/:id/messages

Fetch persisted messages newer than `since`, a timestamp in milliseconds. The widget uses this to recover messages after a disconnected socket or an offline period. This endpoint enforces site ownership.

## DELETE /api/session/:id

Remove the active in-memory session belonging to the requesting site. This does not permanently erase persisted conversation records.

**Response 200** — `{ "success": true }`.

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

Bare health check. Returns `{ status: "ok", timestamp: "..." }`. Used for uptime monitoring and deployment verification.

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

Dashboard endpoints (`/api/admin/*`) require an authenticated session token in the `Authorization: Bearer <jwt>` header. These endpoints manage tenant configuration and require a valid login.
