---
title: Self-hosting
description: Run LeFlux on your own infrastructure.
---

LeFlux is open-source. You can self-host the full stack on your own infrastructure if you need full control over data, custom LLM models, or VPC-only operation.

## Stack

| Component         | Tech                                              | Where                        |
|-------------------|---------------------------------------------------|------------------------------|
| Widget bundle     | Vanilla JS (no framework)                         | `widget/src/`                |
| API server        | Node 20 + Express + Socket.io v4                  | `server/`                    |
| Dashboard         | React 18 + Vite + Tailwind + shadcn/ui            | `dashboard/`                 |
| Crawler           | Playwright + Chromium                             | `crawler/`                   |
| Database          | Firebase Firestore (multi-tenant)                 | `firebase/`                  |
| LLM               | OpenRouter (default: Gemini 2.5 Flash)            | Configurable                 |
| Static delivery   | nginx + Let's Encrypt                             | `server-config/nginx/`       |

## Prerequisites

- A Linux VPS (1 vCPU / 2 GB RAM minimum — comfortable on a $6 DO droplet for low traffic)
- Domain name + DNS A record pointing to the VPS
- Firebase project with Firestore enabled + service account JSON
- OpenRouter API key (or substitute another OpenAI-compatible endpoint)

## Quick spin-up

```bash
# 1. Clone the repo on your VPS
git clone https://github.com/PocketSystems/leflux-docs /var/www/leflux
cd /var/www/leflux

# 2. Install deps
cd server && npm install --omit=dev
cd ../dashboard && npm install && npm run build
cd ../crawler && npm install && npx playwright install chromium --with-deps
cd ../widget && npm run build-bundle  # concat into single file

# 3. Place Firebase service account
cp ~/leflux-cloud-admin.json server/leflux-cloud-admin.json
chmod 600 server/leflux-cloud-admin.json

# 4. Configure env
cat > server/.env << EOF
PORT=3002
NODE_ENV=production
CORS_ORIGIN=*
WS_URL=wss://your-domain.example
OPENROUTER_API_KEY=sk-or-...
LLM_MODEL=google/gemini-2.5-flash
EOF
chmod 600 server/.env

# 5. nginx — copy server-config/nginx/leflux.xrlabs.app.conf, edit server_name, certbot, reload
cp server-config/nginx/leflux.xrlabs.app.conf /etc/nginx/sites-available/your-domain.conf
ln -sf /etc/nginx/sites-available/your-domain.conf /etc/nginx/sites-enabled/
# edit the conf to replace leflux.xrlabs.app with your domain
certbot --nginx -d your-domain.example
nginx -t && nginx -s reload

# 6. PM2 for the server
npm install -g pm2
cd server && pm2 start src/index.js --name leflux-api
pm2 startup && pm2 save
```

Visit https://your-domain.example — dashboard renders. Create your first site, run a crawl, paste the embed snippet on a test page.

## Custom LLM

The default is Gemini 2.5 Flash via OpenRouter. To use another OpenAI-compatible endpoint (Groq, Anthropic, OpenAI direct, self-hosted vLLM):

In `server/.env`:

```
OPENROUTER_API_KEY=your-key-for-any-openai-compat-endpoint
OPENROUTER_BASE_URL=https://api.groq.com/openai/v1   # example: Groq
LLM_MODEL=llama-3.3-70b-versatile                     # match the provider's model id
```

The server uses `chat/completions` with `stream=true` — any standards-compliant endpoint works.

## Custom prompt

`server/src/llm-integration.js` holds the system prompt as a template literal. Edit it directly to add domain-specific instructions, restrict topics, change persona. Rebuild + restart.

## Custom action types

Add a new primitive:

1. `widget/src/action-executor.js` — add the new case to `executeAction` switch.
2. `server/src/llm-integration.js` — add the type to the action schema in the system prompt.
3. `server/routes/chat.js` — add the type to the allowed-types array.

Test on a fresh session.

## Custom block types

Same shape as custom action types, but for `render_ui_block`:

1. `widget/src/ui-blocks.js` — register a renderer at `window.__lefluxBlockRenderers['my_block_type']`.
2. `server/src/llm-integration.js` — describe the block type in the prompt under "Rich UI blocks" so the LLM knows when to use it.

## Firestore schema

```
sites/{siteId}                    — site config doc
  pages/{pageId}                  — crawled pages subcollection
  sessions/{sessionId}            — visitor session log subcollection
  crawl_jobs/{jobId}              — crawl job history subcollection

users/{uid}                       — auth user
  sites: [{siteId, role}, ...]    — sites the user has access to

orgs/{orgId}                      — multi-tenant org
  members/{uid}: {role}           — member subcollection
```

Auth rules live in `firebase/firestore.rules`. Lock them down for multi-tenant security; the included rules are a starting point.

## Updates

```bash
cd /var/www/leflux
git pull origin main
cd server && npm install --omit=dev
cd ../dashboard && npm install && npm run build
pm2 restart leflux-api
nginx -s reload
```

We avoid breaking changes on the embed snippet — `embed.js` is forward-compatible. Server-side schema migrations (if any) ship with migration scripts in `server/migrations/`.

## Support

- Open issues at the [GitHub repo](https://github.com/PocketSystems/leflux-docs).
- Discord (TBD).
- Email: ishaquehassan@digitalhire.com for paid support inquiries.
