---
title: Session persistence
description: How conversations recover across reloads, reconnects, and server restarts.
---

A session is one visitor conversation in one browser. The widget combines local browser history, a live server session, and persisted conversation data when Firebase is configured.

## Storage

| Storage | Contents | Lifetime |
|---------|----------|----------|
| `localStorage` | Session id (`ai_chat_widget_session`) | Until cleared or replaced |
| `localStorage` | Chat history (`ai_chat_widget_history`) | 24 hours from the last save |
| `localStorage` | Widget open/layout state | Until cleared or replaced |
| `localStorage` | Remembered visitor details | 30 days |
| Server memory | Active conversation and task state | 30 minutes idle; at most 1,000 sessions |
| Firestore, when configured | Conversation messages and saved task state | Separate from the browser history lifetime |

The local history expiry does not delete persisted server messages.

## Restore flow

1. The widget reads its saved session id and calls `GET /api/session/:id`.
2. The server checks the requesting site's identity. On a memory miss, it attempts to restore the site's saved session from Firestore.
3. Restore accepts saved state updated within the past 24 hours and respects the server's session capacity. Concurrent recovery requests share the same restore operation.
4. The widget reconnects with Socket.IO and emits `join_session` with the session id **as a string**. A successful join returns `{ sessionId, history }`.
5. If restoration is unavailable, the widget initializes a new session and supplies its recent local conversation history. The server accepts only bounded user/assistant text, never client-supplied system or tool roles.

Firestore recovery requires previously persisted state. A visitor who opened the widget without starting a conversation may have no saved server session.

## Multiple tabs

Tabs on the same origin share localStorage, but LeFlux does not promise live `BroadcastChannel` synchronization of every bubble or layout change.

Only one visitor socket owns a session room at a time. A newer join removes the previous socket and sends it `session_taken_over`. The older widget records the takeover and rejoins before its next message. Events from an evicted socket cannot change the session, and its later disconnect cannot mark the replacement socket offline.

## Reconnect and missed messages

Socket.IO reconnects after a transport interruption. LeFlux also sends application `heartbeat` and `visibility` events to update visitor presence.

Socket delivery is not a durable replay log. The widget uses `GET /api/session/:id/messages?since=<timestamp>` to recover persisted messages after gaps. Recovery depends on server persistence; it does not replay arbitrary page actions.

## Clearing and privacy

Clearing chat history in the widget affects the local transcript. The public `DELETE /api/session/:id` endpoint removes the active in-memory session; it is not a complete erasure API for persisted conversation records.

For data-erasure requests, account for both browser storage and the site's persisted records. Do not assume that the 24-hour local history expiry or 30-minute idle eviction is a server data-retention policy.

## Cross-device and interrupted tasks

There is no automatic cross-device conversation sync. A phone and a laptop have separate browser storage.

Saved task state can be restored with the conversation. The widget also uses a short-lived navigation marker to continue a task after an agent-initiated page navigation. Recovery depends on the saved state and the current page; it is not a guarantee that every interrupted action will run again.
