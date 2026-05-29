---
title: Quick chips
description: Preset prompts shown above the chat input.
---

Quick chips are small clickable suggestions visitors can tap instead of typing. They appear above the input when the chat first opens.

## Anatomy

Each chip has two fields:

- **Label** — the text shown on the chip itself (short, ≤30 chars).
- **Payload** — the message that gets sent when the chip is tapped (longer, descriptive, what the AI sees).

Splitting the two means you can show short eye-friendly labels but send rich queries to the AI.

```json
{
  "text": "Pricing",
  "payload": "Show me the pricing plans and what's included in each."
}
```

The visitor sees "Pricing". The AI receives the full payload.

## Auto-generated from crawl

The crawler auto-generates 3–4 chips based on top pages it discovered. Common defaults:

- Tell me about \{project / product name\}
- Show me your pricing
- How do I get started

Override in **Settings → Quick chips** anytime. Reordering is drag-and-drop.

## When to override

| Crawl-default chip suggestion       | Why you'd replace                                       |
|-------------------------------------|---------------------------------------------------------|
| "Tell me about Agent Shah 3D"       | Too project-specific; replace with broader prompts.    |
| "Show me your pricing"              | Site doesn't have a pricing page; remove the chip.     |
| "How do I get started"              | Already obvious from your hero CTA; replace with X.    |

Curate to whatever 3–4 questions you wish more visitors asked.

## Limits

- Up to **5 chips** per site.
- Each label ≤ 30 characters (renders one-line in the chip pill).
- Each payload ≤ 280 characters.

## Layout-specific behavior

- **Bottom-bar** — chips appear above the bar, centered, wrap to multiple rows on narrow screens.
- **Floating** — chips appear above the input inside the chat-window.
- **Side-panel** — chips appear in the same place as floating (above the input).

Chips hide automatically once the visitor sends their first message — they're a "first impression" affordance, not a permanent menu.

## What gets sent to the widget

```json
{
  "quickChips": [
    { "text": "Pricing",       "payload": "Show me the pricing plans." },
    { "text": "Get started",   "payload": "How do I install and configure?" },
    { "text": "Talk to sales", "payload": "I want to talk to your sales team." }
  ]
}
```
