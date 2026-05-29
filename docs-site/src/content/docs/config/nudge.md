---
title: Nudge messages
description: Proactive tooltip near the launcher that invites the visitor to chat.
---

A small floating bubble that appears next to the launcher a few seconds after the page loads. Optional — off by default, turn on for landing pages with engagement goals.

## When to use it

- **Landing pages** — visitor lands cold, doesn't know they can ask a question. A nudge surfaces the affordance.
- **Pricing / checkout pages** — proactive "any questions about the plans?" can convert hesitant visitors.
- **First-time visitor pages** — combined with a session check, you can show the nudge only on the first visit.

## When NOT to use it

- **Internal apps / authenticated dashboards** — repeat users don't need a poke.
- **Dense info pages** — the bubble adds visual noise. Save it for surfaces with breathing room.

## Configure

**Settings → Nudge messages** in the dashboard.

| Field        | What                                                                             |
|--------------|-----------------------------------------------------------------------------------|
| Show bubble  | Master on/off toggle.                                                            |
| Message      | The tooltip text. Keep under 80 characters. Default placeholder: "Hi! Need help finding something?" |
| Style        | Bubble (rounded chat-bubble shape), Card (soft-shadow rectangle), Minimal (single line, no chrome). |
| Show after   | Delay in seconds before the bubble auto-appears. Default 5s.                     |
| Dismissable  | Show an X to close it. Recommended on.                                           |

## Dismissal cooldown

Once a visitor dismisses the nudge, the widget stores `leflux:nudgeDismissed` in `localStorage` and won't show the bubble again for 24 hours. This means the same visitor doesn't see the nudge on every page nav.

The cooldown is per-domain (because `localStorage` is per-origin). On a session-isolated visit (incognito, new device) the cooldown resets.

## Click-through

Clicking anywhere on the nudge — not just the launcher — opens the chat. The nudge is its own CTA. This is intentional: visitors who notice the message want to engage with the prompt, not hunt for the launcher button.

## What gets sent to the widget

```json
{
  "nudge": {
    "enabled": true,
    "message": "Hi! Need help finding something?",
    "style": "bubble",
    "delay": 5000,
    "dismissable": true
  }
}
```

`delay` is in milliseconds (dashboard shows seconds, server stores ms).

## Renders on all layouts

The nudge appears in floating, bottom-bar, and side-panel layouts. (Earlier versions only rendered on floating — fixed in widget release 2026-05-25.)
