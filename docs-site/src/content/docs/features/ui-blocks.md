---
title: Rich UI blocks
description: Structured cards for pricing, FAQ, link grids, feature comparisons.
---

For data-rich answers — pricing tables, FAQ lists, feature comparisons, link cards — the agent can emit a structured `render_ui_block` instead of plain text. The widget renders it as a styled card themed to your site's brand color, fonts, and button radius.

## When the agent uses them

The crawler stores per-site UI schemas detected from your live pages — pricing tables, feature grids, FAQ sections. When a visitor's question maps to one of these schemas, the agent picks `render_ui_block` with the matching schema.

Examples:

- "Show me the pricing plans" → pricing_cards block
- "What's the difference between Pro and Enterprise" → pricing_cards block (or feature_grid)
- "Do you have an FAQ on cancellations" → faq_list block
- "What integrations do you support" → link_cards block

If no schema matches, the agent falls back to a plain text answer streamed normally.

## Supported block types

### pricing_cards

```json
{
  "block_type": "pricing_cards",
  "data": {
    "plans": [
      {
        "name": "Starter",
        "price": "$19/mo",
        "period": "billed monthly",
        "features": ["10 sites", "1K sessions/mo", "Email support"],
        "cta_label": "Get started",
        "cta_url": "/signup?plan=starter"
      },
      {
        "name": "Pro",
        "price": "$49/mo",
        "highlighted": true,
        "features": ["Unlimited sites", "50K sessions/mo", "Priority support", "Custom themes"],
        "cta_label": "Start free trial",
        "cta_url": "/signup?plan=pro"
      }
    ]
  }
}
```

### feature_grid

```json
{
  "block_type": "feature_grid",
  "data": {
    "features": [
      { "icon": "rocket",   "title": "Fast deploys",   "body": "Push to main, live in 60s." },
      { "icon": "shield",   "title": "Secure by default", "body": "TLS, RBAC, audit logs out of the box." },
      { "icon": "globe",    "title": "Multi-region",   "body": "Edge points in 8 regions." }
    ]
  }
}
```

### faq_list

```json
{
  "block_type": "faq_list",
  "data": {
    "items": [
      { "q": "Can I cancel anytime?",     "a": "Yes. No commitment, prorated refund." },
      { "q": "Do you offer custom plans?", "a": "Yes — contact sales for >100K sessions/mo." }
    ]
  }
}
```

### link_cards

```json
{
  "block_type": "link_cards",
  "data": {
    "cards": [
      { "title": "Slack integration",   "description": "Send chat events to a channel", "url": "/docs/integrations/slack", "icon": "slack" },
      { "title": "Webhook integration", "description": "POST every visitor message",    "url": "/docs/integrations/webhook" }
    ]
  }
}
```

## Theming

Blocks auto-theme via the per-site config:

- Primary color drives accent buttons + highlighted plans
- Typography (heading-font, body-font, button-radius) follows the host site's detected signals
- Dark/light follows the rest of the widget's theme

## Visitor interaction

Clicking a CTA button in a block:

- Opens a regular link if `cta_url` is a full URL (target=_blank).
- Triggers `navigate` if `cta_url` is a path on the current site (preserves SPA state).
- Sends a follow-up message to the agent if `cta_action` is set (e.g. `cta_action: "show_signup_form"`).

## Limits

- Each block max 8 items (plans / features / faqs / cards).
- Each text field max 280 chars (auto-truncated).
- One block per assistant message — they're full-width, multiple stacked would crowd the chat.

## Custom schemas

Custom block types aren't admin-configurable today. The four listed above cover most use cases. If you need a custom block type beyond the built-ins, please email support at ishaquehassan@digitalhire.com to discuss your requirements with the LeFlux team.
