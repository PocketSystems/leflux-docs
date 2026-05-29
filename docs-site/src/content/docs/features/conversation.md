---
title: AI conversation
description: How the conversational layer works and how to think about it.
---

The agent is powered by a fast frontier LLM (Gemini 2.5 Flash by default; configurable on self-hosted installs). Visitor messages flow through:

1. **Frontend** — visitor types in the chat input, hits Enter.
2. **WebSocket emit** — message + current page context posted to the server.
3. **Prompt assembly** — server builds a per-turn prompt: visitor message + page context + Sitemap + Cross-page knowledge + conversation history + a per-iteration state trace.
4. **LLM call** — server streams the response. Each text chunk relays back to the widget for typewriter-style rendering.
5. **Action dispatch** — when the LLM returns an action (click, navigate, sequence), the widget executes it and reports the result back.
6. **Iterate** — server feeds the new context + result into the next LLM call. Up to 30 iterations per task.

## Streaming

Responses stream chunk-by-chunk so visitors see the agent "writing" in real time. Latency to first token is typically under 800ms; full responses average 1.5–3s for short answers.

You can't disable streaming today — it's the only mode.

## Conversation history

Each session keeps a sliding window of the last 50 messages (visitor + assistant + system traces). On every LLM call the prompt includes:

- The first 2 messages (oldest, anchors context)
- The last 50 (most recent)

Long conversations don't blow the context window. The trim function keeps the prompt bounded.

## Context resets

A "task" is a single visitor intent. The server resets per-task state (progress tracker, last-action ID, scroll counts) when:

- Visitor types a new message that doesn't look like an iterative continuation.
- The current task hits `task_complete` or `abort_workflow`.
- Iteration cap (30) is reached.
- Loop guard fires (same click 3x, same nav 2x, scroll-only 3x).

History persists across tasks — the agent remembers earlier exchanges within the session — but task-scoped state resets so the next intent starts clean.

## Multi-step tasks

A single visitor message can trigger multiple actions. Example: "fill out the contact form for me with my info":

```
Iteration 1: action_plan → scroll to contact section
Iteration 2: ask_user → "What's your name?"
            (visitor types: Ahmed)
Iteration 3: ask_user → "Email?"
            (visitor: ahmed@example.com)
Iteration 4: ask_user → "Your message?"
            (visitor: Interested in pricing.)
Iteration 5: action_plan → type name, type email, type message, click submit
Iteration 6: task_complete → "Done! Your message was sent."
```

The visitor sees this as one continuous interaction. The agent decides when to ask, when to execute, when to verify.

## Cancellation

Visitors can cancel a multi-step task at any point by typing "cancel" / "stop" / "ruko" / equivalent in any language. The intent classifier picks this up and routes to abort. The agent confirms ("Okay, cancelled") and the session goes idle.

## Memory across sessions

LeFlux doesn't persist long-term per-visitor memory by default. Each session starts fresh.

If a visitor identifies themselves via a form (name, email, phone), those values land in `user-data-store` (localStorage, 30-day TTL) and the agent will auto-fill the same fields on subsequent forms. This is opt-in per visitor — controlled by your privacy policy.
