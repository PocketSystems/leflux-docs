---
title: WebSocket events
description: Wire protocol between widget and server.
---

LeFlux uses a single long-lived WebSocket connection. Mostly an implementation detail — the embed handles all of it transparently — but exposed here for advanced integrations.

## Connection

URL: `wss://leflux.ai`.

Auth: same model as the REST endpoints — the browser's `Origin` header on the upgrade handshake is matched against the allowed-host list. Visitor session id is passed as a query param OR via the first `join_session` event:

```
wss://leflux.ai?sessionId=<uuid>
```

One socket per session. Server kicks older sockets if a newer one joins the same session room.

## Events — client → server

| Event                    | Payload                                                                       |
|--------------------------|-------------------------------------------------------------------------------|
| `join_session`           | `{ sessionId: string }`                                                       |
| `action_complete`        | `{ sessionId, actionId, result: { success, elementId?, description, error? } }` |
| `sequence_complete`      | `{ sessionId, result: { success, results: StepResult[] } }`                   |
| `update_context`         | `{ sessionId, context: { url, title, indexedElements, visibleText, ... } }`   |
| `continue_task`          | `{ sessionId, context: {...} }` — fires after each action when in iterative mode |
| `confirmation_response`  | `{ sessionId, confirmed: boolean }`                                           |

## Events — server → client

| Event             | Payload                                                                              |
|-------------------|--------------------------------------------------------------------------------------|
| `session_joined`  | `{ sessionId, restored: boolean, history: Message[] }`                               |
| `message_chunk`   | `{ delta: string, streamId: string, chunkIndex: number }` — streamed text deltas    |
| `message_done`    | `{ text: string, streamId: string }` — locks in the streaming bubble                |
| `message`         | `{ text: string, isQuestion?: boolean, isError?: boolean }` — non-streamed message  |
| `action_plan`     | `{ actions: Action[], message: string?, isSequence?: boolean, useUniversalIndexing: true }` |
| `ui_block`        | `{ block_type, data, message? }` — rich card to render                              |
| `confirmation_required` | `{ message, confirm_label, cancel_label }` — high-stakes action gate          |
| `task_complete`   | `{ summary, message }` — multi-step task ended                                       |
| `error`           | `{ message }` — surface to visitor                                                   |

## Action shape (in `action_plan`)

Single action:

```json
{
  "id": "action-1779723850877",
  "type": "click_element",
  "elementId": 19,
  "description": "submit"
}
```

Sequence (multi-step):

```json
{
  "type": "execute_generic_sequence",
  "isSequence": true,
  "actions": [
    { "action": "type",  "elementId": 12, "inputData": "Ahmed", "description": "name" },
    { "action": "type",  "elementId": 13, "inputData": "ahmed@example.com", "description": "email" },
    { "action": "click", "elementId": 19, "description": "submit" }
  ]
}
```

## Liveness + reconnect

Transport-level ping/pong (roughly every 25s) keeps the connection warm and detects dropped connections. If the WebSocket disconnects, the connection auto-reconnects within a few seconds and the server-side session resumes seamlessly.

## Backpressure

Server enforces a max 30 action_plans per task to prevent runaway loops. The widget enforces a max 5 client-side iteration round-trips per visitor message as defense-in-depth.

