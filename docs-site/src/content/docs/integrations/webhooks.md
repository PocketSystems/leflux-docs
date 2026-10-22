---
title: Webhooks
description: Send every LeFlux conversation, message, handoff and form to your own systems the moment it happens, signed in the Standard Webhooks format.
---

A webhook endpoint is a URL you control. LeFlux sends it a signed `POST` every time something you chose happens in your site's chats: a new conversation, a visitor message, a reply, a handoff to your team, a form the agent submitted. Use it to put leads in your CRM, post new chats to Slack, keep a copy in your own database, or drive your own support tools.

Webhooks are part of the **Pro** and **Enterprise** plans, trial included.

## Set one up

1. In the dashboard, open your site and go to **Integrations**.
2. Choose **Add endpoint** and paste your URL. It must be `https://` and reachable from the internet.
3. Pick **All events**, or choose the ones this endpoint needs.
4. Save, then use **Send a test** on the endpoint's page. You see what your endpoint answered right there.

A site can have up to 10 endpoints, each with its own events and its own signing secret.

## Events

| Event | When it is sent |
|---|---|
| `conversation.started` | A visitor sent the first message of a new conversation. |
| `conversation.ended` | The visitor went quiet for 30 minutes, cleared the chat, or a team member closed it. |
| `message.received` | The visitor wrote, in the chat or by replying to one of your emails. |
| `message.sent` | The AI or someone on your team answered the visitor. |
| `message.updated` | Someone on your team edited a reply that was already sent. |
| `message.deleted` | Someone on your team deleted a reply. |
| `handoff.requested` | The visitor asked for a person, or the AI handed the chat over. |
| `handoff.accepted` | Someone on your team took over the conversation. |
| `handoff.ended` | Your team member left and the AI is answering again. |
| `visitor.identified` | LeFlux learned the visitor's name, email or phone during the conversation. |
| `form.submitted` | The agent filled in and submitted a form on your site for the visitor. |
| `cart.item_added` | The agent added a product to the visitor's cart. |

An endpoint set to **All events** also receives events added in the future. Ignore the types you do not handle.

## What a delivery looks like

Every delivery is one event, as JSON:

```json
{
  "id": "evt_mvjpqgg8f5171c142f951e4a",
  "type": "message.received",
  "created_at": "2026-10-22T15:45:44.648Z",
  "api_version": "2026-11-01",
  "site": { "id": "BBGVoC52VvlSo8extwxJ", "domain": "acme.com" },
  "data": {
    "conversation": {
      "id": "c10bc361-636d-4e00-8814-9ce32807b56b",
      "channel": "web",
      "status": "active",
      "handoff": "ai",
      "ai_muted": false,
      "assigned_agent": null,
      "page_url": "https://acme.com/pricing",
      "language": "English",
      "dashboard_url": "https://leflux.ai/app/sites/BBGVoC52VvlSo8extwxJ/sessions/c10bc361-636d-4e00-8814-9ce32807b56b"
    },
    "visitor": {
      "id": "b9f278fb-10c2-47da-8a2c-78ce88e60226",
      "name": "Ayesha Khan",
      "email": "ayesha@example.com",
      "phone": null
    },
    "message": {
      "id": "msg-1792683944037",
      "text": "What does the Pro plan cost?",
      "sender": { "type": "visitor" },
      "created_at": "2026-10-22T15:45:44.038Z",
      "buttons": [],
      "source": { "type": "widget" }
    }
  }
}
```

- `data.conversation` and `data.visitor` are on every event, so you never need a second request to know who it is about.
- `data.message` is on the `message.*` events. `sender.type` is `visitor`, `ai` or `agent` (with `name` for a team member). `source.type` says where it came from: `widget`, `dashboard` or `email`.
- `buttons` on an AI reply are the links it offered, for example `{ "label": "See pricing", "url": "https://acme.com/pricing", "kind": "link" }`.
- Other events add their own field to `data`: `handoff` on `handoff.*`, `reason` on `conversation.ended`, `form` on `form.submitted`, `cart` on `cart.item_added`.
- Visitor `name`, `email` and `phone` are only included when the endpoint's **Include visitor contact details** setting is on. Turn it off for an endpoint that should never hold personal data.
- Test sends from the dashboard carry `"test": true` and sample data.

## Verify the signature

Check every request before you act on it. LeFlux signs in the [Standard Webhooks](https://www.standardwebhooks.com) format, so there is a ready-made library for most languages. Copy the endpoint's secret from its page in the dashboard (it starts with `whsec_`).

Each request has these headers:

| Header | What it is |
|---|---|
| `webhook-id` | The event id. The same on every retry of the same event. |
| `webhook-timestamp` | When this attempt was sent, in Unix seconds. |
| `webhook-signature` | `v1,` followed by the base64 HMAC-SHA256 of `{webhook-id}.{webhook-timestamp}.{body}`. |
| `X-LeFlux-Event` | The event type, for logging and quick routing. |

`X-LeFlux-Event` is not covered by the signature. Verify first, then act on the `type` inside the signed body.

**Node**

```js
import { Webhook } from 'standardwebhooks';

const wh = new Webhook(process.env.LEFLUX_WEBHOOK_SECRET);

// Express: keep the body as the raw string it arrived as.
app.post('/webhooks/leflux', express.text({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = wh.verify(req.body, req.headers);
  } catch {
    return res.status(400).send('bad signature');
  }
  res.sendStatus(200); // answer first
  handle(event);       // then do the work
});
```

**Python**

```python
import os
from standardwebhooks.webhooks import Webhook

wh = Webhook(os.environ["LEFLUX_WEBHOOK_SECRET"])
event = wh.verify(raw_body, request.headers)  # raises if it is not from LeFlux
```

Verify the **raw body**, exactly as it arrived. Parsing the JSON and serialising it again changes the bytes, and the signature will not match. The libraries also reject a timestamp more than five minutes old, which stops a captured request from being replayed later.

**Rotating the secret** on the endpoint's page takes effect at once. Update it wherever you verify signatures straight after.

## Retries

Answer with any `2xx` status within 10 seconds and the delivery is done. Anything else is retried:

| Attempt | After the previous one |
|---|---|
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| 6 | 6 hours |
| 7 | 12 hours |
| 8 | 24 hours |

That is 8 attempts over roughly two days. Redirects are not followed, so give LeFlux the final URL.

- Answer `410 Gone` to tell LeFlux to stop: the endpoint is switched off at once.
- An endpoint that fails every delivery for three days is switched off, and you get an email when it happens. You also get an email once ten deliveries in a row have failed, at most once a day.
- Switching an endpoint back on starts fresh. Events from while it was off are not kept for later.

Every attempt is in the endpoint's delivery log in the dashboard, with the payload, what your endpoint answered, and a button to send it again.

## Things to build in

- **Answer fast.** Return `200` as soon as the signature checks out and do the slow work afterwards. A request that takes longer than 10 seconds counts as failed and is sent again.
- **Expect duplicates.** A retry after a timeout can arrive even though your first attempt went through. Use `webhook-id` to skip an event you have already handled.
- **Do not rely on order.** Deliveries are sent in parallel and retried independently, so a `message.received` can arrive before its `conversation.started`. Use `created_at` when order matters.
- **Delivery logs are kept for 30 days.**
