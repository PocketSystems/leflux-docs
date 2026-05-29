---
title: Config schema
description: Per-site config object — every field, every type.
---

The site config is stored on Firestore at `sites/{siteId}.config` and surfaced to the widget via the `/api/session/init` response. Every field documented below.

## Top-level shape

```ts
type SiteConfig = {
  layout?: 'floating' | 'bottom-bar' | 'side-panel'; // default 'floating'
  primaryColor?: string;       // hex / rgb / hsl / color()
  greeting?: string;           // max 240 chars, supports **bold**
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  siteName?: string;           // shown as "{siteName} Assistant" in header
  logoUrl?: string;            // public image URL, square ≥64px

  typography?: {
    headingFont?: string;
    bodyFont?: string;
    headingWeight?: string;    // CSS font-weight, e.g. '800'
    buttonRadius?: string;     // CSS radius, e.g. '8px'
  };

  launcher?: LauncherConfig;
  nudge?: NudgeConfig;
  quickChips?: QuickChip[];

  allowedHosts?: string[];     // hosts allowed to mount with this site's token

  // Internal — auto-set by the crawler, surfaced as fallback:
  detectedPrimaryColor?: string;
};
```

## LauncherConfig

```ts
type LauncherConfig = {
  shape?: 'circle' | 'squircle' | 'pill';   // default 'circle'
  size?: 'sm' | 'md' | 'lg';                // default 'md'
  icon?: 'chat' | 'sparkle' | 'question' | 'lightning' | 'cursor';  // default 'chat'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offsetX?: number;  // px, default 24
  offsetY?: number;  // px, default 24
  glow?: boolean;    // default true
};
```

## NudgeConfig

```ts
type NudgeConfig = {
  enabled?: boolean;     // default false
  message?: string;      // max 140 chars
  style?: 'bubble' | 'card' | 'minimal';  // default 'bubble'
  delay?: number;        // ms before auto-show, default 5000
  dismissable?: boolean; // default true
};
```

## QuickChip

```ts
type QuickChip = {
  text: string;     // max 30 chars — what shows on the chip
  payload: string;  // max 280 chars — what the AI receives when tapped
};
```

Array max length: 5.

## Conventions

- All color strings must be valid CSS color values. Invalid colors are silently dropped server-side and the widget falls back to defaults.
- Strings that are empty / whitespace-only are dropped; the widget never sees them.
- Boolean defaults are conservative — features off unless explicitly enabled.

## Read flow

```
Firestore site doc.config
   ↓
server/routes/chat.js → resolvePrimaryColor + filter null/empty
   ↓
session/init response.siteConfig
   ↓
embed.js → window.LefluxConfig
   ↓
ChatUI constructor cleanCfg pass → strip null/undefined/empty
   ↓
this.config (final, used for render)
```

If a field is null at any layer it falls through to widget defaults. So missing dashboard config doesn't break the widget; it just uses sensible defaults.

## Write flow (dashboard → Firestore)

Dashboard Settings page builds a partial update:

```ts
firestore.update(`sites/${siteId}`, {
  'config.layout': edits.layout,
  'config.primaryColor': edits.primaryColor,
  // ...etc, one dotted-path per field
});
```

Only changed fields are written. Defaults persist as `null`, not absent.

## Validation

Schema is enforced via Firestore security rules + a server-side validator on the `/api/admin/sites/:id/config` endpoint (admin route). Direct Firestore writes from clients are rejected unless the user has site-edit permission for the org.
