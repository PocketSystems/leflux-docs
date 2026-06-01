---
title: Programmatic API
description: The small imperative surface exposed on window.LeFlux.
---

The widget exposes a minimal global on `window.LeFlux` so you can drive it from your site's own JavaScript.

## Availability

`window.LeFlux` is populated AFTER the widget mounts. Wait for the `leflux:ready` event before calling anything:

```js
window.addEventListener('leflux:ready', () => {
  console.log('LeFlux ready', window.LeFlux);
});
```

If you reference `window.LeFlux` before mount it'll be undefined.

## Methods

### `LeFlux.open()`

Opens the chat panel. No-op if already open.

```js
window.LeFlux.open();
```

Useful for tying a custom button on your site to "open the chat" without using the launcher.

### `LeFlux.close()`

Closes the chat panel.

```js
window.LeFlux.close();
```

### `LeFlux.toggle()`

Toggles open/closed.

### `LeFlux.send(text)`

Sends a message AS THE VISITOR. Useful for deep-link CTAs ("Ask about pricing" buttons that pre-populate the chat).

```js
window.LeFlux.send('Show me the pricing plans');
```

Behaves identically to the visitor typing + pressing Enter. The agent processes it the same way.

### `LeFlux.ask(question)`

Like `send()` but explicitly framed as an ask — agent treats it as a question and prefers an inline answer over actions.

### `LeFlux.setVisitorData({ name, email, phone, ...custom })`

Pre-populate the visitor's data store so form-fills don't ask for fields you already know.

```js
window.LeFlux.setVisitorData({
  name: 'Ahmed Khan',
  email: 'ahmed@example.com'
});
```

Useful on authenticated pages — your app already knows the user, so pre-set the data to skip ask_user.

Values persist in localStorage with the same 30-day TTL as visitor-entered data.

### `LeFlux.dock()` / `LeFlux.undock()`

Programmatically switch between floating mode and docked side-panel mode.

### `LeFlux.clearConversation()`

Wipe the persisted chat history (localStorage) and start a fresh session. Useful for "Reset chat" buttons or post-logout cleanup.

### `LeFlux.showLauncher(visible)`

Per-page override of the dashboard "Hide launcher" setting. Pass `true` to force-show the FAB, `false` to hide. Does NOT persist — refreshing the page returns to whatever the saved dashboard config says.

```js
// Hide the launcher only on /checkout
if (location.pathname === '/checkout') {
  window.addEventListener('leflux:ready', () => window.LeFlux.showLauncher(false));
}
```

### `LeFlux.reindex()`

Force the agent to rescan the page for interactive elements. The widget already reindexes automatically on SPA route changes, modal opens, and DOM mutations — only call this manually if you mutated the DOM in a way the MutationObserver missed (rare, mostly debug).

### `LeFlux.destroy()`

Tear down the widget. Closes WebSocket, removes the shadow root, removes all event listeners. Call this if you need to unmount the widget (e.g. in a SPA where chat is feature-gated by route).

After `destroy()`, calling other methods is a no-op. To remount, reload the page or re-attach `embed.js`.

## State getters

Read-only introspection. All of these return synchronously.

| Method                    | Returns                                                                            |
|---------------------------|------------------------------------------------------------------------------------|
| `LeFlux.isReady()`        | `true` once the widget has mounted + the session is established.                   |
| `LeFlux.isOpen()`         | `true` if the chat panel is currently open.                                        |
| `LeFlux.isExpanded()`     | `true` if docked into side-panel mode.                                             |
| `LeFlux.getLanguage()`    | Last detected reply language code — `'en'`, `'de'`, `'ar'`, `'es'`, `'roman-urdu'`, etc. |
| `LeFlux.getSessionId()`   | Current session UUID, or `null` before `leflux:ready`.                             |
| `LeFlux.getState()`       | Snapshot of everything below.                                                      |

`getState()` returns:

```js
{
  ready: true,
  open: false,
  expanded: false,
  conversation: 'idle',          // 'idle' | 'typing' | 'processing' | 'navigating' | 'awaiting-input'
  language:     'en',
  sessionId:    '...',
  layout:       'floating',
  host:         'example.com'
}
```

`conversation` is the high-level state machine you can wire UI off of (spinner, disabled CTA, analytics events). Listen to `leflux:state-change` for live transitions.

## Subscriptions

`LeFlux.on(name, handler)` — thin sugar over `window.addEventListener('leflux:' + name, handler)`. Returns an `unsubscribe()` function so you don't have to keep a reference to the handler:

```js
const unsub = window.LeFlux.on('reply', (e) => {
  console.log('agent said:', e.detail.text);
});
// later:
unsub();
```

`LeFlux.off(name, handler)` — manual unsubscribe if you already have the handler reference.

## Events

The widget dispatches CustomEvents on `window` you can listen to:

| Event                       | When                                                                                                   |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| `leflux:ready`              | Widget mounted, API available. `detail` is the full `getState()` snapshot.                             |
| `leflux:open`               | Chat opened. `detail.source` is `'click'` \| `'api'` \| `'restore'`.                                   |
| `leflux:close`              | Chat closed. `detail.source` same shape as above.                                                      |
| `leflux:expand`             | Visitor (or `LeFlux.dock()`) docked the chat into side-panel mode.                                     |
| `leflux:collapse`           | Undocked back to floating.                                                                             |
| `leflux:message`            | Visitor sent a message. `detail.text`, `detail.ts`, `detail.sessionId`.                                |
| `leflux:reply`              | Agent finished a reply. `detail.text`, `detail.ts`, `detail.isQuestion`, `detail.isError`.             |
| `leflux:typing-start`       | Agent started typing (dots appeared).                                                                  |
| `leflux:typing-end`         | Typing dots cleared (reply landed OR agent moved to actions).                                          |
| `leflux:state-change`       | Conversation state machine transitioned. `detail.state`, `detail.prev`, `detail.ts`.                   |
| `leflux:action`             | Agent is about to execute an action. `detail.type`, `detail.target`, `detail.description`.             |
| `leflux:navigating`         | An action plan includes a navigate step. `detail.url`, `detail.method`.                                |
| `leflux:language-detected`  | The reply language changed since the last message. `detail.lang`, `detail.prev`.                       |
| `leflux:task_complete`      | Multi-step task ended. `detail.summary`.                                                               |
| `leflux:error`              | An error surfaced. `detail.message`, optional `detail.code`.                                           |
| `leflux:destroy`            | Fires once when `LeFlux.destroy()` completes (window.LeFlux is unset immediately after).               |

Example — fire your analytics on every visitor message:

```js
window.addEventListener('leflux:message', (e) => {
  analytics.track('chat_message', { text: e.detail.text });
});
```

## Embed-script data attributes

A few optional config knobs live on the `<script>` tag instead of the JS API (since they're read before the widget mounts):

| Attribute                      | What                                                            |
|--------------------------------|-----------------------------------------------------------------|
| `data-preview`                 | `"true"` skips server calls entirely — useful for visual testing without registering a site. |
| `data-no-user-memory`          | `"true"` disables the 30-day visitor data cache (no name/email recall across forms). |
| `data-no-visitor-id`           | `"true"` disables the anonymous visitor-id cookie.              |
| `data-no-spa-detect`           | `"true"` disables History API patching (rare, mostly debug).    |
| `data-debug`                   | `"true"` re-enables verbose `[LeFlux]` console logs on a production hostname. By default, logs are silent on customer prod and loud on `localhost` / `*.local` / `staging.*` / `dev.*` / `preview.*` / `test.*`. |

None of these are required. The widget mounts with safe defaults if you paste only the bare snippet.

## Notes

The API is intentionally tiny — most config belongs in the dashboard, not in code. If you find yourself reaching for advanced JS API, the dashboard probably has a knob for it. Contact support at ishaquehassan@digitalhire.com if you hit a real gap.

For server-side integrations (push events into Slack, log to your own analytics backend, custom action verification) see the [WebSocket events](/docs/advanced/websocket-events/) reference.
