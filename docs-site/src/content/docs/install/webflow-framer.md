---
title: Webflow / Framer
description: Install LeFlux on no-code site builders.
---

LeFlux works on any builder that lets you inject a `<script>` tag in the page head or footer. Webflow + Framer both do.

## Webflow

1. Webflow project → **Project Settings → Custom Code**.
2. In the **Footer Code** field paste:

   ```html
   <script src="https://leflux.xrlabs.app/embed.js" async></script>
   ```

3. **Save Changes**.
4. **Publish** to your live `.webflow.io` domain or custom domain. Custom code only runs on published versions, never in the Designer preview.

If you connect a custom domain, make sure that domain is in your allowed-host list in the LeFlux dashboard.

## Framer

1. Framer project → **Site Settings → General → Custom Code**.
2. In **End of `<body> tag`** paste the same snippet.
3. **Save**, then publish.

Framer's preview iframe runs on `framer.app` subdomain — add that to the allowed-host list if you want the widget visible in preview too (most teams only enable it on the published custom domain).

## Carrd

Carrd Pro (or Pro Plus) supports embeds. Add an **Embed** element, choose **Code**, paste the snippet, set **Type: Body**.

## Bubble

Settings → **SEO/Metatags → Script in the body**. Paste, save, deploy.

## Editor.x / Wix Studio

Settings → **Tracking & Analytics → Custom code**. Add → **Body end**. Paste, apply to all pages, save.

## Verification regardless of builder

Open the published URL in incognito, scroll-stop, watch for the launcher. If nothing appears: check the browser console for `[LeFlux]` logs, check the network tab for the embed.js + leflux-agent.js requests.
