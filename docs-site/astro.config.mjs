// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Docs site for the LeFlux widget. Built as a static SPA served at
// https://leflux.ai/docs/ — `base` set accordingly
// so every asset URL resolves under /docs.
export default defineConfig({
  site: 'https://leflux.ai',
  base: '/docs',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    starlight({
      title: 'LeFlux',
      description: 'Give your website hands. Developer docs for the LeFlux AI agent — it answers visitors, opens the right page, fills forms, and books meetings. Install, configure, and extend in one line of code.',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      // The docs themselves are open-source (PocketSystems/leflux-docs is a
      // public repo). The product stays closed-source, but the docs content
      // welcomes edits, so the repo link + per-page "Edit page" button stay.
      social: {
        github: 'https://github.com/PocketSystems/leflux-docs',
      },
      editLink: {
        baseUrl: 'https://github.com/PocketSystems/leflux-docs/edit/main/docs-site/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      components: {
        // Override the page title so install-guide pages show the colored
        // platform logo next to the H1.
        PageTitle: './src/components/PageTitle.astro',
        // Footer adds a LeFlux + Pocket Systems credit under the built-ins.
        Footer: './src/components/Footer.astro',
        // Header logo/brand links to the marketing LANDING ("/") instead of the
        // docs home (/docs/). Host-relative, so works on dev + prod.
        SiteTitle: './src/components/SiteTitle.astro',
      },
      head: [
        // Open Graph + Twitter card so internal LeFlux dashboard /
        // landing links to the docs render with a preview. Dedicated
        // docs OG card (install snippet) at /docs/og.jpg.
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://leflux.ai/docs/og.jpg' },
        },
        { tag: 'meta', attrs: { property: 'og:image:secure_url', content: 'https://leflux.ai/docs/og.jpg' } },
        { tag: 'meta', attrs: { property: 'og:image:type', content: "image/jpeg" } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'LeFlux developer docs — add AI chat in one line of code' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#ee5a30' } },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://leflux.ai/docs/og.jpg' } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'LeFlux developer docs' } },
        // ONE product theme across landing + dashboard + auth + docs. The app
        // persists its choice in `leflux-theme` (light/dark/system); Starlight
        // uses `starlight-theme` (light/dark/auto). Same origin (leflux.ai) ⇒
        // shared localStorage, so on load we map the app's choice into
        // Starlight's key + data-theme (default LIGHT to match the app), and a
        // MutationObserver mirrors the docs' own toggle back into `leflux-theme`.
        // A storage listener keeps a second open tab live. Runs before the
        // widget script so the theme is settled early.
        {
          tag: 'script',
          content: [
            '(function(){',
            "var APP='leflux-theme', SL='starlight-theme';",
            "function toSL(t){return t==='system'?'auto':t;}",
            "function fromSL(s){return s==='auto'?'system':s;}",
            "function resolve(t){return t==='dark'?'dark':t==='light'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}",
            'function applyFromApp(){try{',
            "var app=localStorage.getItem(APP)||'light';",
            'localStorage.setItem(SL,toSL(app));',
            'document.documentElement.dataset.theme=resolve(app);',
            'if(window.StarlightThemeProvider&&StarlightThemeProvider.updatePickers)StarlightThemeProvider.updatePickers(toSL(app));',
            '}catch(e){}}',
            'applyFromApp();',
            'try{new MutationObserver(function(){try{',
            "var app=fromSL(localStorage.getItem(SL)||'auto');",
            'if(localStorage.getItem(APP)!==app)localStorage.setItem(APP,app);',
            "}catch(e){}}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}catch(e){}",
            "window.addEventListener('storage',function(e){if(e.key===APP&&e.newValue)applyFromApp();});",
            '})();',
          ].join(''),
        },
        // Dogfood the LeFlux widget on the docs themselves — every page gets
        // the live assistant (same-origin host, already an allowed site).
        // ORIGIN-RELATIVE on purpose: the SAME static build is served at both
        // leflux.ai/docs (prod) and dev.leflux.ai/docs (dev), so a hardcoded
        // https://leflux.ai/embed.js made dev docs load the PROD widget. `/embed.js`
        // resolves against the current origin → prod docs gets the prod widget,
        // dev docs gets the dev widget. No mixing. (The install snippets in the
        // .md/.mdx pages stay absolute — those are what real customers paste.)
        {
          tag: 'script',
          attrs: { src: '/embed.js', async: true },
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction',  link: '/getting-started/introduction/' },
            { label: 'Quick start',   link: '/getting-started/quick-start/' },
            { label: 'How it works',  link: '/getting-started/how-it-works/' },
          ],
        },
        {
          label: 'Installation',
          items: [
            { label: 'Script tag (any site)',   link: '/install/script-tag/' },
            { label: 'WordPress',               link: '/install/wordpress/' },
            { label: 'Shopify',                 link: '/install/shopify/' },
            { label: 'Webflow / Framer',        link: '/install/webflow-framer/' },
            { label: 'React / Next.js',         link: '/install/react-nextjs/' },
            { label: 'Custom integrations',     link: '/install/custom/' },
          ],
        },
        {
          label: 'Configuration',
          items: [
            { label: 'Dashboard overview',   link: '/config/dashboard/' },
            { label: 'Appearance & layout',  link: '/config/appearance/' },
            { label: 'Launcher button',      link: '/config/launcher/' },
            { label: 'Nudge messages',       link: '/config/nudge/' },
            { label: 'Quick chips',          link: '/config/quick-chips/' },
            { label: 'Greeting & branding',  link: '/config/greeting/' },
            { label: 'Allowed hosts',        link: '/config/allowed-hosts/' },
          ],
        },
        {
          label: 'Features',
          items: [
            { label: 'AI conversation',         link: '/features/conversation/' },
            { label: 'Universal indexing',      link: '/features/universal-indexing/' },
            { label: 'Site crawler & knowledge', link: '/features/crawler/' },
            { label: 'Action execution',        link: '/features/actions/' },
            { label: 'Form auto-fill',          link: '/features/form-fill/' },
            { label: 'Multi-language',          link: '/features/multi-language/' },
            { label: 'SPA navigation',          link: '/features/spa-navigation/' },
            { label: 'Session persistence',     link: '/features/sessions/' },
            { label: 'Streaming responses',     link: '/features/streaming/' },
            { label: 'Rich UI blocks',          link: '/features/ui-blocks/' },
          ],
        },
        {
          label: 'Advanced',
          items: [
            { label: 'Programmatic API', link: '/advanced/programmatic-api/' },
            { label: 'WebSocket events', link: '/advanced/websocket-events/' },
            { label: 'Custom themes',    link: '/advanced/themes/' },
            { label: 'Security model',   link: '/advanced/security/' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'REST endpoints',       link: '/api/rest/' },
            { label: 'WebSocket protocol',   link: '/api/websocket/' },
            { label: 'Config schema',        link: '/api/config-schema/' },
            { label: 'Action types',         link: '/api/actions/' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { label: 'Widget not loading',     link: '/troubleshoot/not-loading/' },
            { label: 'Colors / theme issues',  link: '/troubleshoot/theme/' },
            { label: 'Conflicts with host CSS', link: '/troubleshoot/css-conflicts/' },
            { label: 'Smooth-scroll libraries', link: '/troubleshoot/smooth-scroll/' },
            { label: 'SPA route changes',      link: '/troubleshoot/spa-routes/' },
          ],
        },
        {
          label: 'Release notes',
          link: '/changelog/',
        },
      ],
    }),
  ],
});
