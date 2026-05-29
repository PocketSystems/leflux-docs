# LeFlux Docs

Static documentation site served at https://leflux.xrlabs.app/docs/.

Built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Local development

```bash
cd docs-site
npm install
npm run dev
# → http://localhost:4321/docs/
```

Edit any `.md` / `.mdx` under `src/content/docs/` — Astro hot-reloads.

## Build + preview

```bash
npm run build      # → dist/
npm run preview    # serve dist/ at http://localhost:4321/docs/
```

## Project layout

```
docs-site/
├── astro.config.mjs         # Astro + Starlight config (sidebar, theme, etc)
├── src/
│   ├── assets/              # SVG logos, images
│   ├── content/
│   │   ├── config.ts        # collection schema
│   │   └── docs/            # all the actual docs
│   │       ├── index.mdx    # landing
│   │       ├── getting-started/
│   │       ├── install/
│   │       ├── config/
│   │       ├── features/
│   │       ├── advanced/
│   │       ├── api/
│   │       ├── troubleshoot/
│   │       └── changelog.md
│   └── styles/
│       └── custom.css       # brand theme overlay on Starlight defaults
└── public/
    └── favicon.svg
```

## Adding a new doc

1. Create `src/content/docs/<section>/<slug>.md`:
   ```md
   ---
   title: Your title
   description: One-line description for SEO + meta tags.
   ---

   Content.
   ```
2. Add to the sidebar in `astro.config.mjs` under the appropriate section.
3. `npm run dev` to preview.
4. Commit + push. CI auto-builds + deploys to `/docs/<section>/<slug>/`.

## Deploy

Automatic via `.github/workflows/deploy.yml`:

1. Push to `main`
2. CI runs `cd docs-site && npm ci && npm run build`
3. Rsync `dist/` → server `/var/www/leflux/docs-site/`
4. nginx serves the new files instantly (HTML is no-cache)

No manual deploy step. Edits land live within ~2 minutes of push.

## Theme

Brand purple (`#a855f7` family) applied via `src/styles/custom.css`. Overrides Starlight's default `--sl-color-accent` plus header backdrop blur + sidebar active-item accent.

Dark + light mode automatic via Starlight's built-in theme switcher (top right).

## Search

Powered by [Pagefind](https://pagefind.app/) — generated at build time, indexed across all 40+ docs. The search modal opens via `Cmd-K` / `Ctrl-K`.
