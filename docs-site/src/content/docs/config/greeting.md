---
title: Greeting & branding
description: Welcome text, assistant name, logo override.
---

The first impression. What visitors see when they open the chat for the first time.

## Greeting

The text inside the chat-window before any conversation. Default: `Hey there! 👋 How can I **help** you today?`.

Configure in **Settings → Greeting**. Plain text + a single optional `**bold**` markdown span for an accent word. Bold text renders in your primary color.

| Field      | Limits                                                                             |
|------------|------------------------------------------------------------------------------------|
| Greeting   | Up to 240 chars. Multi-line allowed. One `**word**` for the accent treatment.     |

If no `**bold**` is present, the LAST meaningful word gets the accent automatically. So "Welcome to our store" renders as "Welcome to our **store**".

## Assistant name

What the chat header calls the agent. Default: `{Site name} Assistant`. Where `{Site name}` is your domain's display name (auto-derived from the site title during crawl, or override in Settings → Branding).

Common patterns:

- "**Acme** Assistant" — neutral, fits any company
- "**Aria**" — gives the assistant a name; humanizes the interaction
- "**Ask Acme**" — call-to-action framing
- "**Help Bot**" — utility framing

## Logo

The square icon shown next to the assistant name in the header.

Three sources, in priority order:

1. **Settings → Branding → Logo URL** — paste a public URL to a square image (PNG, SVG, ideally 64×64+).
2. **Crawled favicon** — if no override, the crawler uses your site's favicon.
3. **Letter fallback** — first letter of the assistant name, in a primary-color gradient square.

Letter fallback always works, so even a brand-new site has a polished header on day one.

## Online status

The green dot + "Online" pill under the assistant name shows on every layout. It's always green when the widget is mounted (since the AI is always available). There's no admin control to turn it off — visitors expect this signal, removing it harms trust.

## Per-visitor personalization

The widget remembers a returning visitor's name (collected via ask_user during a form-fill) for 30 days in localStorage. On their next visit, the greeting can address them by name if your prompt template supports it. This is built-in — no admin config needed.

## Localization

The greeting is one fixed string regardless of the visitor's language. The agent reply mirrors the visitor's typed language per turn — but the WELCOME message stays in whatever language you wrote it. If your visitors span multiple language groups, write the greeting in your dominant language; the rest of the conversation auto-adapts.
