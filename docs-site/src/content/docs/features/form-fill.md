---
title: Form auto-fill
description: How the agent fills out forms safely.
---

The agent can fill out any form on your site — contact forms, signup, project inquiry, checkout. The flow is deliberately conservative to avoid half-submitted forms.

## The flow

When the visitor says something like "fill out the contact form" or "hire me":

1. **Locate the form**. Indexed elements that have a `required: true` flag + sit inside the same `parent` group (form heading) constitute the target form.
2. **Identify missing values**. The agent checks `previouslyFilledFields` + `user-data-store` (cross-session memory) + conversation history. Any required field WITHOUT a known value triggers `ask_user`.
3. **Ask one at a time**. Each `ask_user` emits a question and field-type hint. The visitor answers, the value is stored. The agent loops back to step 2.
4. **Single atomic submit**. Once every required field has a value, the agent emits a single sequence with type-step-per-field + a final click on the submit button.
5. **Verify success**. Next iteration checks for: URL change to `/thank-you`, success-modal appearance, form reset, success-toast text. Only if one of these signals fires does the agent emit `task_complete`.

## Field detection

Indexed elements expose:

- `type` — `text`, `email`, `phone`, `tel`, `number`, `date`, `password`, `textarea`, `select`
- `required` — when native `required`, `aria-required="true"`, or the literal attribute is present
- `parent` — the form's heading text or container, for disambiguation
- `value` — current value (so the agent can skip already-filled fields)
- `options` — for `<select>`, the list of choices

The agent prioritizes required fields. Optional fields are filled if the visitor provided values; otherwise skipped.

## ask_user contract

When the agent needs a value:

```json
{
  "type": "ask_user",
  "question": "What's your email address?",
  "field_name": "email",
  "field_type": "email"
}
```

The widget renders the question as an assistant bubble. Visitor types the answer. The widget classifies the response (data vs cancel vs new command) and either:

- **Data** — value gets stored in `formFieldsState`, agent gets the value in the next iteration's context.
- **Cancel** — current task aborts.
- **New command** — current task suspends; new task starts; on completion, the suspended task resumes (or doesn't, per visitor follow-up).

## Persistent memory

Values the visitor provides during one form-fill (name, email, phone, address) are cached in `localStorage` under `leflux:userData` with a 30-day TTL. Next time the visitor fills any form on the same domain, the agent auto-fills those fields without re-asking. This is opt-in per visitor — there's no server-side identity tied to it.

To opt out: visitor can clear site data, or you can disable this behavior with the `data-no-user-memory` attribute on your embed snippet.

## Multi-step / multi-page forms

If a form spans multiple pages (next-button progression), the agent fills the visible step, clicks Next, re-indexes the new page, fills the next step. Same loop, no special config.

## What's NOT supported

- **File uploads** — the agent cannot upload files. If a form requires a file, the agent asks the visitor to pick one and pauses.
- **CAPTCHA** — never bypassed. If a form has a captcha, the agent fills everything up to the captcha and asks the visitor to solve it before the final submit.
- **Payment fields** — credit card / bank account fields are never filled by the agent. If the visitor explicitly tells the agent a number, the agent refuses and asks the visitor to enter it directly.

## Confirmation gate

For destructive or irreversible actions inside a form (e.g. "Delete account" submit, "Purchase" submit, "Send to all customers"), the agent can request explicit confirmation via:

```json
{
  "type": "confirmation_required",
  "message": "Submit this contact form to Acme Sales?",
  "confirm_label": "Submit",
  "cancel_label": "Cancel"
}
```

Visitor taps Confirm → sequence runs. Cancel → task aborts. This is automatic for actions the agent detects as high-stakes; it's not configurable per-form today.

## Status feedback

While the form-fill sequence executes, the chat shows a transient status bubble: "Submitting form…", "Filling email…". These auto-clear on success. Failures surface in the next assistant bubble with a clear reason.

See [Action execution](/docs/features/actions/) for the underlying primitives.
