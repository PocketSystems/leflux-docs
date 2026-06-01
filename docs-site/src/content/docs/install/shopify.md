---
title: Shopify
description: Install LeFlux on a Shopify store via theme code.
---

The cleanest path on Shopify is editing `theme.liquid` directly. Works on every theme.

## Step-by-step

1. Shopify admin → **Online Store → Themes**.
2. Find your live theme, click **Actions → Edit code**.
3. In the file tree open **`layout/theme.liquid`**.
4. Search for `</body>`. Right above it paste:

   ```html
   <script src="https://leflux.ai/embed.js" async></script>
   ```

5. **Save**.

## Don't touch checkout

Shopify's `checkout.liquid` is locked unless you're on Plus. The widget WILL render on product pages, collection pages, the cart, and any custom pages — but NOT on the native checkout flow. That's intentional and good — you do NOT want a chat widget interfering with payment.

If you DO need a chat widget on Plus checkout: pre-install gives you `checkout.liquid` access. Paste the same snippet before `</body>` there too. Add `checkout.shopify.com` (or whatever Shopify's tenant subdomain is for you) to the allowed-host list.

## Theme app extensions (alternative)

If your theme uses Online Store 2.0 you can install via a **theme app extension** instead of editing code. This is cleaner for theme updates but requires building a Shopify app. For most stores the `theme.liquid` route is simpler and equally durable — Shopify rarely overwrites `theme.liquid` on theme updates.

## Verifying it works

1. Open your storefront in an incognito window.
2. The launcher should appear in the corner you configured.
3. Ask: "show me bestsellers" — agent should crawl-search the term and navigate / list products.

## Cart-aware actions

The widget can fill quantity selectors, click variant pickers, and add items to cart — it operates on whatever the visitor sees. There's no Shopify-specific API call; the agent uses Shopify's own DOM buttons. Works on any theme.

## Custom apps + token guard

If you embed in a custom app frame (Shopify admin custom apps): allowed-host list must include the custom-app iframe origin, not just your storefront. Check the embedding iframe's `window.location.host` and add that exact string to your dashboard.
