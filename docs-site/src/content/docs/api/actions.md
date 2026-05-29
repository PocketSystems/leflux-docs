---
title: Action types
description: Every action.type the agent can emit and the widget can execute.
---

The agent's full action vocabulary. Reference for self-hosters extending the schema + integrators logging events.

## Action primitives (inside `execute_generic_sequence.steps`)

| `action`     | Args                                            | What                                                     |
|--------------|-------------------------------------------------|-----------------------------------------------------------|
| `click`      | `elementId: number`                             | Click the element by index                                |
| `type`       | `elementId`, `inputData: string`                | Type into an input / textarea                             |
| `select`     | `elementId`, `inputData: string`                | Pick a `<select>` option matching inputData               |
| `scroll_to`  | `elementId: number`                             | Scroll the element into the viewport                     |
| `navigate`   | `url: string`                                   | SPA-aware nav (relative path / pathname#hash / full URL) |
| `wait`       | `waitDuration: number` (ms)                     | Pause N ms before the next step                          |

Optional fields on every step:
- `description: string` — one short label for logging.

## Top-level action types (emitted directly, not nested in a sequence)

### `execute_generic_sequence`

The most common shape. Wraps the primitives above.

```json
{
  "type": "execute_generic_sequence",
  "steps": [
    { "action": "type",  "elementId": 12, "inputData": "Ahmed" },
    { "action": "click", "elementId": 19, "description": "submit" }
  ]
}
```

### `click_element`

Single click. Slightly more lightweight wire format.

```json
{
  "type": "click_element",
  "elementId": 19,
  "description": "open menu"
}
```

### `ask_user`

Pause the task and ask the visitor for a value.

```json
{
  "type": "ask_user",
  "question": "What's your email address?",
  "field_name": "email",
  "field_type": "email"
}
```

`field_type`: `text | email | phone | number | date | address | password`.

### `task_complete`

Multi-step task ended successfully.

```json
{
  "type": "task_complete",
  "summary": "Sent the contact form."
}
```

### `abort_workflow`

The task can't be achieved; explain why.

```json
{
  "type": "abort_workflow",
  "reason": "I couldn't find that page on the site."
}
```

### `none`

Pure information answer, no DOM action.

```json
{
  "type": "none"
}
```

The accompanying `message` field carries the answer.

### `render_ui_block`

Render a structured card instead of plain text. See [Rich UI blocks](/docs/features/ui-blocks/).

```json
{
  "type": "render_ui_block",
  "block_type": "pricing_cards",
  "data": { "plans": [...] }
}
```

### `confirmation_required`

High-stakes action gate.

```json
{
  "type": "confirmation_required",
  "message": "Delete this account permanently?",
  "confirm_label": "Delete",
  "cancel_label": "Cancel",
  "pending_action": { ... the action to execute on confirm ... }
}
```

Visitor taps Confirm → server executes `pending_action`. Cancel → task aborts.

## Result shape (sent back via `action_complete`)

```ts
type ActionResult = {
  success: boolean;
  elementId?: number;
  selector?: string;       // legacy fallback when ID-less
  url?: string;            // for navigate results
  description?: string;    // human-readable summary
  error?: string;          // present on failure
  text?: string;           // for type/select — the value entered
};
```

For sequences, the result is `{ success, results: StepResult[], completedSteps: number, totalSteps: number }`.

## How the LLM picks an action

The LLM follows the [Operating principles](/docs/getting-started/how-it-works/#operating-principles) and the navigation decision tree:

1. Information question → `none` with inline answer from knowledge base.
2. UI-block-compatible question → `render_ui_block`.
3. Singular navigation intent → single `navigate` or `click` in a sequence.
4. Form-fill → multi-step `execute_generic_sequence`.
5. Missing required value → `ask_user`.
6. Done + verified → `task_complete`.
7. Can't proceed → `abort_workflow`.

Each iteration also receives a `[state]` system message describing what the previous action did (URL change, no-op, etc) so the LLM can self-correct.
