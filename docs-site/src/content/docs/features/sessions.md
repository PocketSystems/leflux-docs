---
title: Session persistence
description: How conversations survive page reloads and tab switches.
---

A "session" in LeFlux is a single ongoing visitor conversation. It survives:

- Page reloads
- Cross-page navigations (SPA + hard reloads)
- Browser tab close + reopen (within 24h)
- Network blips (auto-reconnect)

## Storage

| Where        | What                                                              | TTL                       |
|--------------|-------------------------------------------------------------------|---------------------------|
| `localStorage` | Session id, full message history, widget state (open/docked)    | 24h (default)             |
| `localStorage` | User data (name, email, phone) from form-fills                  | 30 days                   |
| Server       | Session state + history + crawled context                         | 30 min idle eviction      |
| Server (persisted) | Persisted message log (for dashboard analytics)              | Forever (until you delete) |

## Restore flow

When the widget mounts on a page:

1. Read `leflux:sessionId` from localStorage.
2. If found AND under 24h old, call `POST /api/session/<id>` to verify the server still has it.
3. Server responds with restored history + active task state.
4. Widget hydrates the chat-window with the prior messages.
5. If the previous session is gone (server-evicted past 30min idle), widget starts a fresh session — but visitor sees the locally-cached messages so the UI doesn't go blank.

## Cross-tab behavior

Multiple tabs of the same origin share the same localStorage. Two tabs of your site = same session id = same conversation.

A `BroadcastChannel` syncs state across tabs:

- Visitor types in tab A → message appears in tab B too.
- Tab B opens chat → tab A's open state mirrors.
- Chat closes in either → all tabs close.

If two tabs send a message simultaneously, the server enforces one-socket-per-session (newer socket wins). The older tab gets a brief "another tab took over" indicator and goes read-only for a few seconds.

## Manual reset

Visitors can clear the session by:

- **Long-pressing the chat header** → "Clear conversation" appears.
- Or via `localStorage.clear()` from DevTools.

After clear, the next message starts a fresh session with a new id.

## Privacy controls

You control session retention via the dashboard:

- **Settings → Privacy → Session retention** — default 24h on client + 30min idle on server. Reduce for high-privacy contexts.
- **Settings → Privacy → Message log** — toggle whether messages persist on our servers for dashboard review. Default ON for analytics.

Visitors can request deletion via your site's privacy mechanism; LeFlux exposes a `DELETE /api/session/:id` for one-off purges.

## Anonymous by default

Sessions are NOT tied to a visitor identity. A `leflux:visitorId` cookie is generated per browser for analytics aggregation but isn't tied to any PII. If your privacy policy requires zero anonymous tracking, set `data-no-visitor-id` on the embed snippet.

## Liveness

Transport-level ping/pong (about every 25s) keeps the connection warm and lets the server detect dropped sockets quickly. After 30 minutes of session inactivity (no new visitor messages OR action results) the server-side session evicts; localStorage history on the client still survives the 24h TTL and a fresh session_init reuses it.

## Cross-device

There's no cross-device session sync — sessions are per-browser. Visitor on phone + laptop = two separate sessions. (Coming later if there's demand.)

## What happens on reload mid-task

If the visitor reloads while an action sequence is mid-execution:

- Server holds the task state for 30s post-disconnect.
- Widget re-mounts on the new page, restores localStorage state, reconnects WS.
- Server resumes the task from where it left off if the new page's URL matches the expected next-step URL.
- Otherwise the task aborts cleanly with a "we got interrupted by a reload — what next?" message.
