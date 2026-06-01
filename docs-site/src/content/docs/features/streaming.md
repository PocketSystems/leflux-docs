---
title: Streaming responses
description: Token-by-token rendering so the chat feels alive.
---

LeFlux streams the LLM's text output chunk-by-chunk over WebSocket so the visitor sees the agent "writing" in real time, similar to ChatGPT's typewriter effect.

## Wire format

Server emits three events per turn:

| Event           | Payload                                                                       |
|-----------------|-------------------------------------------------------------------------------|
| `message_chunk` | `{ delta: string, streamId: string, chunkIndex: number }`                     |
| `message_done`  | `{ text: string, streamId: string }`                                          |
| `action_plan`   | `{ actions: [...], message: string|null, useUniversalIndexing: true }`        |

`message_chunk` fires multiple times during generation. Widget appends each delta to a single in-flight message bubble. `message_done` locks the bubble + reconciles with the final server-parsed text (handles escape-unwind edge cases). `action_plan` fires once at the end with the actions the agent decided to execute.

## Deduplication

Each stream has a unique `streamId`. If the WebSocket reconnects mid-stream, the server re-emits already-sent chunks — the widget drops duplicates based on `(streamId, chunkIndex)` so the bubble doesn't double up.

## Latency

| Metric                    | Typical     | Best         |
|---------------------------|-------------|--------------|
| First token after enter   | 600–900ms   | ~350ms       |
| Full short answer         | 1.5–2s      | ~1s          |
| Multi-paragraph answer    | 3–5s        | ~2s          |

Server-side, streaming begins as soon as our AI model produces its first token, typically in under 1 second.

## Why streaming matters

Without streaming the visitor stares at a typing indicator for 2–3 seconds before any text. With streaming they see words almost immediately and can read along as the agent thinks. Perceived latency drops dramatically even though the total time is identical.

## Bubble lifecycle

1. First `message_chunk` creates a new `.message.assistant.streaming` bubble with `data-streaming="1"` and a blinking caret span.
2. Subsequent chunks append to the bubble's text. The caret stays at the end.
3. `message_done` removes `data-streaming` + caret, persists text to localStorage, and refocuses the input.

If the agent emits `render_ui_block` instead of plain text (rich cards for pricing / FAQ / etc), the streaming bubble is discarded silently and replaced with the structured block.

## Cancellation

If the visitor types a NEW message mid-stream, the in-flight bubble is finalized (whatever text arrived locks in) and the new message starts a fresh turn. The server still completes the in-flight LLM call to keep history consistent, but its actions don't execute.

## Streaming + actions

If the agent's response includes both a message AND an action:

- Text streams normally.
- After `message_done`, the action fires.
- Visitor sees: text appears → assistant says it's about to do X → status bubble "executing X…" → result.

This pattern keeps the visitor informed about WHAT the agent is doing, not just THAT it's doing something.

## Formatting

The streamed text supports a minimal markdown subset, parsed client-side on each chunk:

- `**bold**` → `<strong>` (renders in primary color for emphasis)
- `*italic*` → `<em>`
- `` `code` `` → `<code>` inline
- `- item` / `* item` → bulleted list
- `1. item` → numbered list
- `\n\n` → paragraph break

URLs auto-link. No raw HTML — visitors can't be tricked into clicking through HTML injected into a streamed response.

## Disabling

You can't disable streaming today. It's the only mode. (Earlier widget builds had a non-streaming fallback for very old browsers; we removed it once WebSocket support became universal.)
