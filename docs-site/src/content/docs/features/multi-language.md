---
title: Multi-language support
description: How LeFlux mirrors the visitor's language every turn.
---

The widget supports every language a frontier LLM does — English, Spanish, French, German, Roman Urdu, Devanagari Hindi, Arabic, Portuguese, Chinese, Japanese, Russian, anything.

## The contract

Every visitor message gets a language detection pass. The agent replies in the SAME language and script as the visitor's most recent message — not the conversation average, not the first message, the LATEST one.

If the visitor switches languages mid-conversation, the agent switches with them on the very next turn.

## Detection algorithm

1. Read the visitor's current message.
2. Detect the script + dominant vocabulary:
   - All-ASCII English vocabulary → English
   - All-ASCII non-English vocabulary (Roman Urdu / Romanized Hindi / Romanized Arabic) → that romanized form
   - Non-Latin script (Devanagari, Arabic, Cyrillic, CJK) → that script
   - Mixed code-switching → match the dominant language of the last 1–2 messages
3. Write the entire reply in the detected language. No mixing.

## Why this matters

Most chatbots either:
- Reply in their default language regardless of input (terrible UX)
- Translate to a single configured language (wrong for multi-lingual visitors)

LeFlux's per-turn mirror means a Karachi visitor can write in Roman Urdu, get a Roman Urdu reply, switch to English for the next question, get an English reply. Zero configuration on the admin side.

## Greeting language

The chat's welcome message (set in Settings → Greeting) is one fixed string. It doesn't auto-translate. The conversation that follows mirrors the visitor's typed language; the greeting stays whatever you wrote.

If your visitors span multiple language groups: write the greeting in your dominant audience's language. The agent picks up the rest.

## Quick chip language

Quick chip labels + payloads are admin-configured strings, used as-is. They don't translate. The agent reply to a chip-clicked payload follows the language-detection rule on the payload itself.

If your audience is multilingual, configure your chips in the language you expect most visitors to type. The agent reply will mirror whatever language the visitor responds in.

## Untranslated technical terms

Element names, project names, brand names, and proper nouns stay in their original casing. The agent says "Click the **Send Transmission** button" even when the rest of the reply is in Roman Urdu, because "Send Transmission" is the literal button label.

## Right-to-left scripts

Arabic, Hebrew, Persian. The widget detects RTL content and renders message bubbles right-aligned with proper bidirectional text rendering. Input field stays LTR by default (visitors can switch via their OS input method).

## Languages currently tested

| Language | Script             | Tested? |
|----------|--------------------|---------|
| English  | Latin              | ✓       |
| Roman Urdu | Latin (Romanized) | ✓       |
| Hindi    | Devanagari         | ✓       |
| Spanish  | Latin              | ✓       |
| French   | Latin              | ✓       |
| German   | Latin              | ✓       |
| Arabic   | Arabic             | ✓       |
| Portuguese | Latin            | ✓       |
| Italian  | Latin              | ✓       |
| Chinese (Simplified) | CJK    | ✓       |
| Japanese | Hiragana+Kanji     | ✓       |

Untested languages still work via the LLM's training — open an issue if you hit one that doesn't.

## Per-language defaults

Coming soon: language-specific quick chips. Today, set chips in your dominant language; they don't auto-translate.
