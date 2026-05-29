---
title: Action execution
description: Five primitives the agent uses to operate on the page.
---

The agent never writes code. It picks from five atomic action primitives, optionally composed into multi-step sequences. The widget executes them and reports the result.

## Primitives

### click

Click an element by id.

```json
{ "action": "click", "elementId": 19 }
```

Execution:

1. Scroll the element into the visible area (center, with adjustments for sticky headers + the chat panel itself).
2. Check for blocking overlays (modals, banners). If one's there + closeable, close it. If it's not closeable but the click can still fire directly, proceed.
3. Dispatch `element.click()`. For submit buttons inside forms, also try `form.requestSubmit(button)` + `form.dispatchEvent(SubmitEvent)` so the click always lands even if React form state disables the button.

Failure modes: element disappeared from index (stale id), element disabled, blocking overlay non-closeable.

### type

Type a value into an input or textarea.

```json
{ "action": "type", "elementId": 12, "inputData": "Ahmed Khan" }
```

Execution:

1. Scroll into view + focus.
2. Set value via the React-compatible native value setter (so controlled components receive the change).
3. Dispatch `input` + `change` events so frameworks pick it up.

Bulk-paste — values are typed as one event, not character-by-character. Faster and more reliable than per-char typing.

### select

Pick an option from a `<select>`.

```json
{ "action": "select", "elementId": 7, "inputData": "Premium" }
```

The widget matches `inputData` against `<option>` labels (exact, case-insensitive). If no match, returns a failure result and the agent gets the available list back in the state trace.

### scroll_to

Scroll the page so an indexed element is centered in the viewport (adjusted for sticky chrome).

```json
{ "action": "scroll_to", "elementId": 18 }
```

Doesn't change the URL. Common use: bring a form section into view before filling.

### navigate

Hard / soft navigation to a URL.

```json
{ "action": "navigate", "url": "/contact" }
```

For SPA hosts (Next.js, React Router, Vue Router) the widget uses History API + dispatches a `popstate` so client-side routing kicks in — no full reload, session state preserved.

For non-SPA sites it falls through to `window.location.href` for a real page load.

URL can be:

- Relative path: `/contact`
- Path + hash: `/#contact`, `/blog/post#author`
- Full URL: `https://acme.com/contact` (only on the same origin)

Cross-origin navigates are rejected (security).

### wait

Pause for N milliseconds.

```json
{ "action": "wait", "waitDuration": 800 }
```

Used to let an async modal / dropdown render before the next step interacts with it. Rare — most flows don't need it because the indexer re-scans before each step.

## Sequences

Multiple steps in a single atomic emission. Used for form fills:

```json
{
  "type": "execute_generic_sequence",
  "steps": [
    { "action": "type",  "elementId": 12, "inputData": "Ahmed Khan" },
    { "action": "type",  "elementId": 13, "inputData": "ahmed@example.com" },
    { "action": "type",  "elementId": 14, "inputData": "Hi, interested in pricing." },
    { "action": "click", "elementId": 19, "description": "submit" }
  ]
}
```

Executes in order. If a step fails, the sequence aborts and the failure (with the index of the failed step) is reported back to the LLM, which can recover or ask the visitor for help.

## Verification

After each action the widget reports:

```json
{
  "success": true,
  "elementId": 19,
  "description": "Clicked element 19"
}
```

The server enriches this with a state trace ("URL /a → /b ✓ navigated" or "URL unchanged at /a — NO-OP, switch strategy") that the LLM sees on its next call.

## Why this set of primitives

These five cover ~98% of practical web automation. Hover, drag-drop, custom-keypress, file-upload are intentionally NOT primitives — they're rare, security-sensitive, and don't generalize cleanly across tenants. If your use-case needs one, see [Programmatic API](/docs/advanced/programmatic-api/) for the imperative escape hatch.

## Restricted actions

Site admins can restrict specific action types per-site (e.g. disable `navigate` on a single-page kiosk). Settings → Restrictions in the dashboard.
