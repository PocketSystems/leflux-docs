---
title: React / Next.js
description: Install LeFlux in a React or Next.js app.
---

LeFlux runs in the visitor's browser, not on your server, so it works in any React / Next.js app the same way as a plain script tag.

## Next.js (App Router)

In `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://leflux.xrlabs.app/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

No `data-site-token` to set. The widget identifies your site from the browser's `Origin` header against the allowed-host list you configure in the LeFlux dashboard. As long as your production domain is in that list, the widget mounts.

`strategy="afterInteractive"` matches the widget's design — it doesn't need to load before hydration, and waiting until after gets you a faster First Contentful Paint.

## Next.js (Pages Router)

In `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://leflux.xrlabs.app/embed.js"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  );
}
```

## Plain Create React App / Vite

Put the script tag in `public/index.html`:

```html
<body>
  <div id="root"></div>
  <script src="https://leflux.xrlabs.app/embed.js" async></script>
</body>
```

Same on Vite — put it in `index.html` at the project root.

## React Router / Next.js client-side navigation

LeFlux is SPA-aware. It listens to History API events (`pushState`, `replaceState`, `popstate`) so when you navigate via `<Link>` it:

1. Detects the route change.
2. Re-indexes interactive elements on the new page.
3. Preserves the chat conversation across routes.

You don't need to re-mount the widget on route changes — the single embed instance handles every route in your app.

## Server-side rendering (Next.js, Remix, SvelteKit)

`embed.js` is purely client-side. It checks for `typeof window !== 'undefined'` before doing anything, so it's safe to include in SSR'd templates. Nothing runs at build/render time.

## Environment-conditional rendering

If you don't want the widget on certain environments (e.g. preview deploys you don't want to crawl), gate the script:

```tsx
const showWidget = process.env.NEXT_PUBLIC_ENABLE_LEFLUX === '1';

return (
  <>
    {/* ...your app... */}
    {showWidget && (
      <Script
        src="https://leflux.xrlabs.app/embed.js"
        strategy="afterInteractive"
      />
    )}
  </>
);
```

Production + staging use SEPARATE sites in the LeFlux dashboard, each with their own allowed-host list. Same embed snippet works on both — the server routes traffic to the correct tenant via the request `Origin`.

## Verifying it works

After deploy, open Chrome DevTools → Network. You should see two requests on first load:

- `embed.js` (~5 KB)
- `leflux-agent.js` (~150 KB gzipped)

Then a `wss://leflux.xrlabs.app/socket.io/` WebSocket connection in the WS tab.

If `embed.js` 200s but `leflux-agent.js` is 4xx or missing — the host wasn't allowed. Check **Dashboard → Settings → Allowed hosts** and make sure your prod domain is in the list.
