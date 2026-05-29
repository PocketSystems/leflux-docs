---
title: Dashboard overview
description: Tour of every panel in the LeFlux dashboard.
---

The LeFlux dashboard at [leflux.xrlabs.app](https://leflux.xrlabs.app) is where you configure every aspect of your widget — appearance, behavior, allowed hosts, crawled knowledge.

## Top-level layout

| Section          | What it does                                                                  |
|------------------|--------------------------------------------------------------------------------|
| **Sites**        | List of every site in your org. Each site has its own token, theme, crawl, allowed hosts. |
| **Site detail**  | Per-site control: settings, crawl runs, sessions, activity, install snippet.  |
| **Settings**     | Account-level: profile, billing, team members.                                |

## Site detail tabs

When you click into a site you see five tabs:

### Overview

Snapshot of: page count crawled, total sessions, last crawl run, current widget config. The "Install snippet" block lives here too — copy-paste ready.

### Settings

Where you actually configure the widget. Eight subsections:

- [Appearance & layout](/docs/config/appearance/) — primary color, layout (floating/bottom-bar/side-panel), greeting, position.
- [Launcher button](/docs/config/launcher/) — shape, size, icon, position offset, glow toggle.
- [Nudge messages](/docs/config/nudge/) — optional proactive tooltip near the launcher.
- [Quick chips](/docs/config/quick-chips/) — preset prompts shown above the input.
- [Greeting & branding](/docs/config/greeting/) — welcome text + assistant name + logo override.
- [Allowed hosts](/docs/config/allowed-hosts/) — domains where this token can mount.
- **Crawler** — recrawl schedule + page cap + ignored paths.
- **Danger zone** — delete site (irreversible — wipes sessions, crawl data, and tokens).

### Site Scan

Runs the crawler against your domain. Shows live progress (pages walked, found, extracted). Re-running replaces the previous crawl. Schedule recurring crawls if your content changes often.

### Sessions

Every visitor session against this site. Click into one to see the full conversation: visitor messages, assistant replies, actions emitted, results.

### Activity

High-level feed across sessions: what visitors typically ask, where they navigate, where they bounce. Useful for spotting common questions you could answer better in your knowledge base.

## Per-site vs account-level

- **Per-site config** (color, layout, nudge, greeting): saved on the site doc in Firestore. Server forwards to widget on every `/api/session/init` call.
- **Account config** (email, profile, billing): saved on the user doc. Doesn't affect the widget directly.

## Live theme

Theme changes are LIVE — save in the dashboard, reload your site, the widget reflects the change without rebuilding anything. There's no caching layer in between (other than the visitor's browser cache, which expires hourly).

## Sandbox preview

Settings → Appearance has a live widget preview. Changes there don't save until you click **Save**, so you can experiment freely.
