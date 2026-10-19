---
title: Add AI chat to your website
description: Add LeFlux AI chat to your website, connect public pages, and test answers, navigation, and supported forms before visitors use it.
---

An AI chat widget is useful when it can answer from **your website**, not just give a generic reply. LeFlux uses the pages connected to your site as its knowledge source. It can also help a visitor open the relevant page and work through a supported form in their browser.

This guide takes you from a site you control to a tested visitor experience. For the dashboard's exact setup steps, follow the [quick start](/docs/getting-started/quick-start/).

## 1. Connect the site and check its pages

Add your domain in LeFlux, then review the pages available in your site's Knowledge area. Start or refresh the site crawl when your public content has changed. Check that the pages visitors ask about—services, prices, policies, products, or contact details—are present and readable. If information is missing from the source page, update that page before expecting a reliable answer.

LeFlux cannot read pages behind a login just because the widget is installed. See [site crawler and knowledge base](/docs/features/crawler/) for how public pages are collected and how to inspect a crawl.

## 2. Install the widget

After your site is registered, add this script to pages where visitors should see LeFlux:

```html
<script src="https://leflux.ai/embed.js" async></script>
```

The page does not need a public API key. The widget uses the site and allowed hosts configured in the dashboard. Choose the guide that matches your stack: [plain HTML](/docs/install/script-tag/), [WordPress](/docs/install/wordpress/), [Shopify](/docs/install/shopify/), [Webflow or Framer](/docs/install/webflow-framer/), or [React and Next.js](/docs/install/react-nextjs/).

## 3. Test questions your visitors really ask

Open your live site in a fresh browser session and try three different requests:

1. **A fact on your site:** Ask about a published price, policy, or service. Compare the reply with its source page.
2. **A page to find:** Ask to see a specific product or contact page. Confirm that the resulting link or navigation points to the right place.
3. **A next step:** If your site has a supported form, ask LeFlux to help fill it. Check the values and submission result before relying on that workflow.

Do not assume an answer or action succeeded solely because the chat said it did. Verify what happened on the website. If a response lacks the right facts, inspect the crawl and update the source content. If a route or form behaves unexpectedly, use the [SPA navigation](/docs/features/spa-navigation/) and [form assistance](/docs/features/form-fill/) guides.

## 4. Make the experience fit your site

Use the [dashboard settings](/docs/config/dashboard/) to adjust the widget's appearance, greeting, and allowed hosts. Then test it on desktop and mobile. If it does not appear, start with the [widget loading checklist](/docs/troubleshoot/not-loading/).

Visitors may still need a person for exceptions or sensitive questions. The [customer support assistant guide](/docs/guides/ai-customer-support-assistant/) explains how to test a handoff to your team.
