---
title: WebSocket protocol
description: Real-time event protocol between widget and server.
---

Detailed at [WebSocket events](/docs/advanced/websocket-events/). This page is the quick reference.

## URL

```
wss://leflux.xrlabs.app/socket.io/?sessionId=<uuid>
```

Self-hosted equivalents follow the same shape. There is no token in the URL — the Socket.io upgrade handshake passes the visitor's browser `Origin`, which the server validates against the allowed-host list the same way as the REST endpoints.

## Client → server events

| Event                    | Payload                                                                  |
|--------------------------|--------------------------------------------------------------------------|
| `join_session`           | `{ sessionId }`                                                          |
| `update_context`         | `{ sessionId, context }`                                                 |
| `continue_task`          | `{ sessionId, context }`                                                 |
| `action_complete`        | `{ sessionId, actionId, result: { success, elementId?, description, error? } }` |
| `sequence_complete`      | `{ sessionId, result }`                                                  |
| `confirmation_response`  | `{ sessionId, confirmed }`                                               |

## Server → client events

| Event                    | Payload                                                                 |
|--------------------------|-------------------------------------------------------------------------|
| `session_joined`         | `{ sessionId, restored, history }`                                      |
| `message_chunk`          | `{ delta, streamId, chunkIndex }`                                       |
| `message_done`           | `{ text, streamId }`                                                    |
| `message`                | `{ text, isQuestion?, isError? }`                                       |
| `action_plan`            | `{ actions, message?, isSequence?, useUniversalIndexing: true }`        |
| `ui_block`               | `{ block_type, data, message? }`                                        |
| `confirmation_required`  | `{ message, confirm_label, cancel_label }`                              |
| `task_complete`          | `{ summary, message }`                                                  |
| `error`                  | `{ message }`                                                           |

## Context shape (passed in `update_context` + `continue_task`)

```json
{
  "url": "https://acme.com/pricing",
  "title": "Pricing — Acme",
  "indexedElements": [
    {
      "id": 5,
      "type": "button",
      "text": "Get started",
      "required": false,
      "parent": "Hero CTA"
    }
  ],
  "visibleText": "Choose a plan...",
  "forms": [
    {
      "name": "contact-form",
      "fields": [
        { "elementId": 12, "name": "name",  "type": "text",  "required": true,  "label": "Your name" },
        { "elementId": 13, "name": "email", "type": "email", "required": true,  "label": "Email" }
      ]
    }
  ],
  "previouslyFilledFields": [
    { "elementId": 12, "value": "Ahmed Khan", "timestamp": 1779723850877 }
  ]
}
```

## Action shapes

Single action:

```json
{
  "id": "action-1779723850877",
  "type": "click_element",
  "elementId": 19,
  "description": "submit contact form"
}
```

Sequence:

```json
{
  "type": "execute_generic_sequence",
  "isSequence": true,
  "actions": [
    { "action": "type",  "elementId": 12, "inputData": "Ahmed" },
    { "action": "click", "elementId": 19, "description": "submit" }
  ]
}
```

See [Action types](/docs/api/actions/) for every valid `action.type` value.

## Liveness semantics

Socket.io's own transport ping/pong (default 25s interval) detects dropped sockets. There's no application-level `heartbeat` event today. Server-side session eviction triggers after 30 min of inactivity (no visitor messages OR action results). After eviction, the widget re-inits via `POST /api/session/init` on the next page load.

## Reconnect

Socket.io's built-in exponential backoff handles transient disconnects. Widget shows a brief "Reconnecting…" status if disconnect lasts >2s. On reconnect, the server replays any events the widget missed during the gap.

## Bidirectional one-socket-per-session

Server enforces a single socket per session room. If a second socket joins the same `sessionId`, the older socket gets kicked. Prevents duplicate event delivery in multi-tab scenarios.
