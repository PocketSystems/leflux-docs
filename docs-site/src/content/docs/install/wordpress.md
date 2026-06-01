---
title: WordPress
description: Install LeFlux on a WordPress site without touching theme files.
---

Three ways to add the LeFlux snippet to WordPress, fastest to most explicit.

## Option A — header/footer plugin (recommended)

Easiest, theme-independent, survives theme updates.

1. Install **WPCode** (formerly Insert Headers and Footers) or any equivalent.
2. In WordPress admin → **WPCode → Header & Footer**.
3. In the **Footer** section paste:

   ```html
   <script src="https://leflux.ai/embed.js" async></script>
   ```

4. **Save**.
5. Visit your site in an incognito window to verify the launcher appears.

## Option B — theme editor

Works on classic themes that expose template files.

1. WordPress admin → **Appearance → Theme File Editor**.
2. Open `footer.php`.
3. Right before `</body>` paste the snippet from Option A.
4. **Update file**.

Themes that update via the theme store will overwrite this on every update. Prefer Option A unless you use a child theme.

## Option C — block theme (FSE) site editor

For full-site-editing themes (Twenty Twenty-Four+, Spectra, Kadence, etc).

1. **Appearance → Editor → Patterns** (or **Templates → Footer**).
2. Add a **Custom HTML** block at the bottom of the footer template.
3. Paste the snippet, save.

## Caching gotchas

If your site uses WP Rocket, WP Super Cache, W3 Total Cache, or LiteSpeed Cache:

- Clear the cache after pasting the snippet, otherwise visitors see a stale page without the widget.
- Some caches inline + minify external scripts — add `https://leflux.ai/embed.js` to the **JS exclusion list** so it's loaded as-is. Don't combine it with other scripts.

## CDN gotchas

If you proxy through Cloudflare:

- The `embed.js` request itself is `Cache-Control: no-cache` so each visitor always gets the latest bundle. No special Cloudflare config needed.
- If you have **Rocket Loader** enabled, LeFlux may load LATE. Disable Rocket Loader on the page or add `data-cfasync="false"` to the script tag.

## Verification

Open Chrome DevTools → Network → reload. You should see two requests to `leflux.ai`:

- `/embed.js` — small loader
- `/leflux-agent.js` — the main bundle (~150 KB gzipped)

If only `/embed.js` appears and `/leflux-agent.js` is missing or 4xx, the site init was rejected because your domain isn't in the allowed-host list. Open the LeFlux dashboard → Settings → Allowed hosts and add your WordPress site's domain (and `www.` variant if you use one).

## Multilingual sites (Polylang / WPML)

The widget auto-mirrors the visitor's typed language per turn. You don't need to install separate snippets for each language. One token covers all languages on the same domain.
