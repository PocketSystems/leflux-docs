---
title: WebSocket events
description: Wire protocol between widget and server.
---

LeFlux uses a single long-lived WebSocket connection. Mostly an implementation detail — the embed handles all of it transparently — but exposed here for advanced integrations.

## Connection

Use the Socket.IO client with `https://leflux.ai`; this is not a raw WebSocket protocol. The widget uses polling transport for compatibility with host-site CSP policies.

```js
const socket = io('https://leflux.ai', { transports: ['polling'] });
socket.on('connect', () => socket.emit('join_session', sessionId));
```

`join_session` takes a UUID string, not an object or a URL query parameter. Before joining, the server resolves the browser Origin through site authentication and checks that the session belongs to that site. Owner previews may supply their preview token through Socket.IO `auth.previewToken`.

Keep session ids private. Origin identifies the hosting site in a browser; it is not a user login credential and can be supplied by non-browser clients.

After a successful join, visitor events must target that session and the socket must still own its room. A newer join emits `session_taken_over` to the older socket and revokes its room membership.

## Events — client → server

| Event                    | Payload                                                                       |
|--------------------------|-------------------------------------------------------------------------------|
| `join_session`           | `sessionId: string`                                                       |
| `action_complete`        | `{ sessionId, actionId, result: { success, elementId?, description, error? } }` |
| `sequence_complete`      | `{ sessionId, result: { success, results: StepResult[] } }`                   |
| `update_context`         | `{ sessionId, context: { url, title, indexedElements, visibleText, ... } }`   |
| `continue_task`          | `{ sessionId, context: {...} }` — fires after each action when in iterative mode |
| `confirmation_response`  | `{ sessionId, confirmed: boolean }`                                           |

## Events — server → client

| Event             | Payload                                                                              |
|-------------------|--------------------------------------------------------------------------------------|
| `session_joined`  | `{ sessionId, history: Message[] }`                               |
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

## Liveness and reconnect

In addition to transport ping/pong, the widget sends `heartbeat` (`{ sessionId, tabVisible }`) and `visibility` (`{ sessionId, visible }`). These events require current session-room ownership.

Reconnect joins the session again. Persisted messages can be recovered through the HTTP messages endpoint; there is no guarantee of replay for arbitrary socket events. See [Session persistence](/docs/features/sessions/).

## Loop limits

The default server iteration cap is 20, increasing to 30 for navigation-heavy tasks. `MAX_TASK_ITERATIONS` can override it. Progress and repeated-action guards may stop a task earlier.
