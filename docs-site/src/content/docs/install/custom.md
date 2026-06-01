---
title: Custom integrations
description: Vue, Angular, Svelte, vanilla SPA, mobile WebViews, anywhere with a window object.
---

LeFlux is framework-agnostic. If your stack runs in a browser and supports a `<script>` tag (or its equivalent), it works. The same one-line snippet — no tokens, no keys — works everywhere because the LeFlux server identifies your site via the browser's `Origin` header.

## Vue

In `index.html`:

```html
<body>
  <div id="app"></div>
  <script src="https://leflux.ai/embed.js" async></script>
</body>
```

Or via a Vue component using `useScriptTag` from VueUse if you prefer programmatic loading.

## Angular

In `index.html`:

```html
<body>
  <app-root></app-root>
  <script src="https://leflux.ai/embed.js" async></script>
</body>
```

If you need to load it dynamically inside an Angular service:

```ts
@Injectable({ providedIn: 'root' })
export class LefluxLoader {
  load() {
    if (document.getElementById('leflux-embed')) return;
    const s = document.createElement('script');
    s.id = 'leflux-embed';
    s.src = 'https://leflux.ai/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }
}
```

## Svelte / SvelteKit

`app.html`:

```html
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
  <script src="https://leflux.ai/embed.js" async></script>
</body>
```

## Solid / Qwik / Astro / Remix

Same pattern — drop the script tag in your root HTML template. None of these frameworks need anything special because the widget is a self-contained shadow-rooted island.

## Mobile WebViews

If you embed your site inside an Android / iOS WebView (React Native WebView, Capacitor, Cordova) the widget works the same — it's just JavaScript in a browser-like context.

- Make sure the WebView allows WebSocket connections (Capacitor's `cors` config; React Native's `originWhitelist`).
- The host shown by `window.location.host` is what you register in the allowed-host list. For `file://` based WebViews you may need to use the WebView's `applicationNameForUserAgent` + a hosted shim, since `file://` won't match a domain allow-list.

## Server-rendered platforms (Rails, Django, Laravel)

Drop the snippet in your application layout template:

| Platform | File |
|----------|------|
| Rails | `app/views/layouts/application.html.erb` |
| Django | `templates/base.html` |
| Laravel | `resources/views/layouts/app.blade.php` |
| Phoenix | `lib/<app>_web/templates/layout/root.html.heex` |

No environment variables, no template helpers needed — the snippet is the same string everywhere.

## Programmatic loading (no script tag)

If you want full JS-level control of when the widget mounts:

```js
function loadLeflux() {
  return new Promise((resolve, reject) => {
    if (document.getElementById('leflux-embed')) return resolve();
    const s = document.createElement('script');
    s.id = 'leflux-embed';
    s.src = 'https://leflux.ai/embed.js';
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

// Call when ready — after login, after consent, whenever:
loadLeflux().then(() => console.log('LeFlux ready'));
```

The widget exposes nothing on the global scope by default — everything lives inside its shadow root. See [Programmatic API](/docs/advanced/programmatic-api/) for the (small) imperative surface.
