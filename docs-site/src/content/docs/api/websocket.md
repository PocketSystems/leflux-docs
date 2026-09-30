---
title: WebSocket protocol
description: Real-time event protocol between widget and server.
---

Detailed at [WebSocket events](/docs/advanced/websocket-events/). This page is the quick reference.

## Connection

Use the Socket.IO client with `https://leflux.ai`; this is not a raw WebSocket protocol. The widget uses polling transport for compatibility with host-site CSP policies.

```js
const socket = io('https://leflux.ai', { transports: ['polling'] });
socket.on('connect', () => socket.emit('join_session', sessionId));
```

`join_session` takes a UUID string, not an object or a URL query parameter. Before joining, the server resolves the browser Origin through site authentication and checks that the session belongs to that site. Owner previews may supply their preview token through Socket.IO `auth.previewToken`.

Keep session ids private. Origin identifies the hosting site in a browser; it is not a user login credential and can be supplied by non-browser clients.

After a successful join, visitor events must target that session and the socket must still own its room. A newer join emits `session_taken_over` to the older socket and revokes its room membership.

## Client → server events

| Event                    | Payload                                                                  |
|--------------------------|--------------------------------------------------------------------------|
| `join_session`           | `sessionId: string`                                                          |
| `update_context`         | `{ sessionId, context }`                                                 |
| `continue_task`          | `{ sessionId, context }`                                                 |
| `action_complete`        | `{ sessionId, actionId, result: { success, elementId?, description, error? } }` |
| `sequence_complete`      | `{ sessionId, result }`                                                  |
| `confirmation_response`  | `{ sessionId, confirmed }`                                               |

## Server → client events

| Event                    | Payload                                                                 |
|--------------------------|-------------------------------------------------------------------------|
| `session_joined`         | `{ sessionId, history }`                                      |
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

## Liveness and reconnect

Socket.IO handles transport ping/pong and reconnect backoff. The widget also emits `heartbeat` (`{ sessionId, tabVisible }`) and `visibility` (`{ sessionId, visible }`) for application presence.

On reconnect the widget rejoins the session. `session_joined` returns conversation history; the HTTP messages endpoint recovers persisted messages missed during a gap. Arbitrary socket events and page actions are not automatically replayed.

Only one socket owns a visitor session room. An evicted widget rejoins before its next send. See [Session persistence](/docs/features/sessions/) for recovery limits.
