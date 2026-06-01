---
title: Security model
description: How LeFlux keeps your visitors safe and your data isolated.
---

## What the widget does

- Mounts inside a shadow root so it can't read host-page DOM outside its own subtree (shadow DOM closed-ish — actually open mode but with strict input/output isolation).
- Communicates with the LeFlux API over TLS.
- Stores conversation locally (localStorage) and on our servers.
- Executes click/type/navigate on the live page — same as a visitor would.

## What the widget does NOT do

- **Doesn't run arbitrary code**. Only executes pre-defined primitives (click, type, navigate, scroll, select, wait) on indexed elements. No `eval`, no dynamic `<script>` injection.
- **Doesn't read DOM outside its own scope unless prompted**. The dom-inspector samples interactive elements + visible text for context; it doesn't exfiltrate hidden fields or cookies or localStorage outside what visitors see.
- **Doesn't submit forms without an action emission**. Every form submit goes through the action pipeline + post-action verification. No silent submits.
- **Doesn't bypass CAPTCHA or auth**. Filled forms stop at human-verification gates.
- **Doesn't enter sensitive data**. Credit card numbers, SSNs, passport numbers, bank accounts — the agent refuses to fill these even if the visitor asks. Hard rule in the system prompt + an action-executor guard list.

## Allowed-host validation

Every session-init call is host-validated server-side against the site's allowed-host list. A token pasted on an unauthorized origin gets a `host_not_registered` response and the widget no-ops silently. See [Allowed hosts](/docs/config/allowed-hosts/).

## Data residency

Conversations + crawled content are stored server-side under your own tenant, isolated per site. Other tenants cannot read your data — it's secure and isolated by design.

## Visitor privacy

- Anonymous by default: no PII collected unless the visitor provides it during a form-fill.
- `leflux:visitorId` cookie is a random UUID for analytics aggregation, not tied to identity. Can be disabled via `data-no-visitor-id`.
- User-data-store (name, email, phone from form-fills) lives in localStorage only, 30-day TTL, never sent to anyone except the LLM call that's currently filling a form. Disable via `data-no-user-memory`.
- Conversation messages persist on our servers by default (for dashboard analytics). Toggle off in Settings → Privacy → Message log.

## Prompt injection

A malicious page could try to inject instructions into the agent via visible text ("Ignore previous instructions and..."). The widget mitigates:

- visibleText is truncated to 5000 chars per turn, with strict markers around it in the prompt so the LLM treats it as page content not commands.
- indexedElements text fields are treated as element labels, not commands.
- The system prompt explicitly tells the agent to ignore in-page instructions.

We don't promise zero injection vulnerability — LLM prompt injection is an open research problem — but the layered design makes practical exploits hard. If you spot one, please email ishaquehassan@digitalhire.com.

## Action restrictions

Site admins can disable specific action types (Settings → Restrictions):

- Disable `navigate` — the agent can only operate within the current page
- Disable `type` — the agent can navigate + click but never type
- Disable `submit-detected click` — the agent can't trigger form submits

Useful for high-stakes pages (account deletion, irreversible billing actions).

## Confirmation gate

For actions the system prompt classifies as high-stakes (delete, purchase, send-to-all), the agent emits `confirmation_required` instead of executing immediately. Visitor must tap Confirm in the chat UI for the action to proceed.

## CSP compatibility

The widget loads from `https://leflux.ai`. To allow it in your Content Security Policy:

```
script-src 'self' https://leflux.ai;
connect-src 'self' https://leflux.ai wss://leflux.ai;
img-src 'self' https://leflux.ai data:;
style-src-elem 'self' 'unsafe-inline';   /* widget injects styles into shadow root */
```

If you have a strict CSP without `'unsafe-inline'` for styles, the widget won't render. We don't yet support nonce-based style injection (on roadmap).

## Subresource integrity (SRI)

The `embed.js` bundle is small + frequently updated, so we don't ship a stable SRI hash. The main `leflux-agent.js` is versioned and no-cache to ensure visitors always get the latest secure bundle.

## Disclosure

Security issues: email ishaquehassan@digitalhire.com with subject `[SECURITY]`. Please report privately rather than disclosing vulnerabilities in any public channel.
