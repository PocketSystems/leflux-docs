---
title: Quick start
description: Install LeFlux on any site in under five minutes.
---

import { Steps } from '@astrojs/starlight/components';

This walks you from zero to a working widget. You'll need a site you control + access to a browser.

<Steps>

1. **Create your LeFlux account.**

   Go to [leflux.ai/signup](https://leflux.ai/signup) and sign in. The dashboard opens.

2. **Add your site.**

   Click **Add site** in the dashboard. Enter the domain you want to install on (e.g. `acme.com`). LeFlux will validate the domain isn't taken in your org and create a project for it.

3. **Run the crawl.**

   On the site detail page click **Start crawl**. The crawler walks your site (BFS, max 60 pages by default) and builds the knowledge base. This usually finishes in 30s–2min depending on site size. You'll see progress live.

4. **Pick a theme + layout.**

   In **Settings** → **Appearance**, pick:
   - **Layout** — Floating bubble (default), Bottom bar pill, or Side panel.
   - **Primary color** — usually auto-detected from your site palette. Override if you want.
   - **Greeting** — the welcome text inside the chat.
   - **Launcher** — shape, size, icon, position.

5. **Copy the embed snippet.**

   Settings → **Install** shows the one-line snippet. It looks like:

   ```html
   <script src="https://leflux.ai/embed.js" async></script>
   ```

   That's the entire integration. No tokens, no API keys — the widget identifies your site automatically via the browser's Origin header against the **Allowed hosts** list you set in Settings.

6. **Paste it on your site.**

   - **Plain HTML** — put it in `<head>` or right before `</body>`.
   - **WordPress** — Appearance → Theme File Editor → `footer.php` before `</body>`. Or use a header-and-footer plugin.
   - **Shopify** — Online Store → Themes → Edit code → `theme.liquid` before `</body>`.
   - **Next.js / React** — paste in `_document.tsx` head or in `layout.tsx` as a `<Script>`.

   See [Installation guides](/docs/install/script-tag/) for details on every platform.

7. **Open your site.**

   Reload your site. The launcher appears in the bottom-right corner. Click it — chat opens. Ask anything. The agent reads your live page + crawled knowledge base.

</Steps>

## What just happened

When the script loads it:

1. Calls `POST /api/session/init` against the LeFlux API. The server reads the request's `Origin` header (which browsers won't let JS forge cross-origin), matches it against your site's allowed-host list, and returns the per-site config (theme, layout, crawled-color, launcher, nudge, etc).
2. Renders the widget UI inside a shadow root so it can't collide with your site's CSS.
3. Builds an index of every interactive element on the current page.
4. Opens a WebSocket to stream AI responses + execute returned actions.

Every visitor session is isolated. The agent's actions are scoped to the visitor's browser tab — nothing runs on a server in your visitor's name.

## Next

- [How it works under the hood](/docs/getting-started/how-it-works/) — the iterative loop, universal indexing, and the knowledge-base contract.
- [Configure the widget](/docs/config/dashboard/) — per-site appearance, launcher, nudge, chips.
- [Action types](/docs/api/actions/) — what the agent can do on a page.
