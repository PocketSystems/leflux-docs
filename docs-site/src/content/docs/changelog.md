---
title: Release notes
description: What's new in LeFlux.
---

Reverse chronological. Dates are the date the change landed in production.

## 2026-07-10

### Dashboard

- **Image gallery on the Knowledge page**: The "Images" count on your Knowledge page is now clickable and opens a full screen gallery of every image found across your whole site, with a link back to the page each one came from.
- **Redesigned media viewer on page detail**: Clicking an image on a page's Media tab now opens a full screen viewer with next/previous navigation, a thumbnail strip, captions, and support for videos, instead of a small static grid.
- **Live crawl progress no longer disappears**: The live scanning panel on your site's dashboard no longer vanishes partway through a scan. It now stays visible and accurate until the crawl finishes.
- **Deleting a site now fully removes its data**: Removing a site from your dashboard now cleans up everything associated with it, including its pages, chat sessions, and scan history, instead of leaving leftover data behind.
- **Fixed: deleting a site no longer fails**: The delete option in site Settings now completes reliably instead of returning an error and leaving the site in place.
- **Fixed: taken to the right place after deleting or transferring a site**: After deleting or transferring a site from Settings, you're now returned to your dashboard instead of being sent to the marketing homepage.

### Server

- **More reliable full-site crawling**: Sites that redirect from their bare domain to "www" (or the other way around) are now crawled completely, instead of stopping after a single page.
- **Crawls no longer collide**: Starting a scan twice in a row (for example, by clicking twice) no longer runs two scans at once and slowing each other down.
- **Cleaner formatting for long answers**: Long lists of details, like plan features or specifications, are now automatically formatted into readable bullet points instead of a dense run-on paragraph.
- **Always a way to reach a human**: If the assistant can't complete a task after several tries, it now always offers to connect you with a person on your team instead of ending the conversation.
- **Smarter answers by business type**: The assistant now automatically adapts its guidance for restaurants, clinics, stores, real estate, education, and legal sites, for example steering toward reservations, appointments, or stock questions as appropriate.
- **More complete answers on long pages**: The assistant is now better at finding and including key details like prices, hours, and contact info buried in the middle of long pages, and keeps more of the conversation in mind so it doesn't forget details a visitor already shared.
- **Accurate form submission confirmations**: The assistant now checks whether a form actually submitted successfully before telling a visitor it worked, and says so honestly if it couldn't confirm or if it failed.
- **Fewer repeated questions**: The assistant now accepts a visitor's answer after two failed attempts instead of asking again indefinitely, and no longer sends duplicate messages when the same message is submitted twice by accident.
- **Friendlier form validation**: Numeric answers, like a budget or quantity, are now accepted correctly, and validation messages always use plain, friendly field names instead of raw internal labels.
- **Faster multi-step tasks**: Tasks that need several steps, like filling out a form, now complete in fewer round trips, so the assistant responds faster.

### Landing

- **Smarter live demo**: The interactive homepage demo no longer re-asks for details you've already given, presents multiple matching results as tappable buttons instead of a wall of text, and only asks you to tap a button when one is actually available in the demo.
- **Faster homepage load**: The homepage now loads faster on first visit thanks to a leaner initial page.

## 2026-07-03

### Widget

- **Highlighted form fields**: When the assistant asks you to fill in a field, it now draws a clear highlight ring and a callout pointing right at that field, staying perfectly aligned even as the page scrolls or the layout shifts.
- **Fills in more kinds of form fields**: The assistant can now fill in many more field types beyond plain text boxes, including toggles, sliders, star ratings, date and color pickers, custom dropdowns, autocomplete boxes, and rich text editors.

## 2026-07-02

### Landing

- **Live Playground**: a new interactive demo on the homepage lets visitors paste their own website's URL and watch LeFlux operate a live preview of that exact site, with a chat widget already installed and themed to match the site's own brand colors. Visitors can keep chatting to see the assistant answer questions and navigate pages before signing up, on both desktop and mobile views.
- **Playground takes center stage**: the live demo now sits directly under the homepage headline, so visitors can try it right away instead of scrolling to find it.
- **More accurate demo answers**: the assistant in the live demo now answers exactly what was asked, avoids repeating a previous answer, and reliably navigates to the right page for requests like "show me pricing" instead of just describing it.
- **Clear message when a site can't be previewed**: if a website can't be loaded for the live demo (for example, it blocks automated visits), the playground now shows a clear explanation and a way to try again instead of an endless loading state.
- **Invitation to start a trial**: after a few messages in the live demo, visitors are invited to start a free trial to keep exploring.
- **"Fork in the road" problem section**: the homepage's problem section has been redesigned to visually contrast losing a visitor with an old style widget against capturing them with LeFlux, with a smoother, more reliable animation as you scroll to it.

## 2026-06-24

### Landing

- **Human Handoff section redesigned**: The homepage handoff section has been rebuilt as a live, animated two-panel demo. The visitor's chat widget and your team's support inbox appear side by side on a distinct tinted background, connected by a wire with a traveling spark. Typing indicators appear before each message, the AI identity morphs to a human agent when the handoff occurs, and a live badge lights up in the inbox. The demo now runs reliably from first visit and respects reduced-motion preferences. Both panels are clearly labelled so the agent view is unmistakable.

### Billing

- **Plan card buttons aligned**: Call-to-action buttons on pricing cards now sit at the bottom of each card, keeping them visually level across plans that have different numbers of feature items.
- **Monthly billing only**: The annual/monthly billing toggle has been removed from pricing and the billing page. All plans are currently billed monthly.

## 2026-06-23

### Widget

- **Talk-to-human button**: Visitors can now request a live agent from within the chat. When an agent joins, a live banner appears; when the agent ends the session the AI picks back up automatically.
- **AI co-replies during live handoff**: The AI continues answering visitor questions alongside the human agent by default. Agents can silence it at any time from the dashboard.
- **Email replies appear in the chat thread**: When a visitor returns after going offline, agent email replies sent while they were away appear inline in the chat, keeping the conversation continuous.
- **Offline visitor reconnects to an available agent**: A visitor who hit the no-agent offline path is automatically offered a live connection as soon as an agent becomes available and they send another message.
- **Screen reader support**: AI and agent messages are now announced by screen readers; the launcher button correctly reports its open or closed state to assistive technology; the chat panel has a proper dialog role and label.
- **Follow-up email highlighted**: When a visitor leaves their contact address in the offline flow, the address is shown in bold in the confirmation message so they can easily verify what was recorded.
- **Warmer AI handoff message**: The AI's message when a visitor requests human help now stays warm and open-ended, reminding them the AI is available any time to keep helping.
- **Chat header icon fix on light themes**: The handoff icon in the chat header now appears white on light-themed sites, consistent with the other header icons.
- **AI typing visible when co-replying**: When the AI is answering alongside a human agent, the thinking indicator reappears. Agent and AI typing indicators merge into one combined animation.
- **"Connecting..." clears when agent joins**: The connecting status disappears as soon as an agent joins, rather than staying on screen permanently.
- **Composer stays active in live mode**: The message input no longer becomes unresponsive after sending during a live handoff.
- **No thinking dots when AI is muted**: The AI thinking animation is suppressed when the agent has turned AI co-reply off, removing the misleading "Still thinking..." hint.

### Dashboard

- **Support inbox**: A new Support section lets agents claim visitor handoff requests, reply in real time, and hand back to the AI when done. Includes presence indicators, browser notifications, and an AI copilot with suggest, summarize, and ask tools.
- **Email and offline inbox**: Offline visitors and visitors who leave mid-chat now appear in an "Email and offline" inbox. Agents reply by email from the same thread, and visitor replies come back in automatically.
- **Edit or delete AI and agent messages**: Agents can correct or remove an AI or agent message directly in the support thread. The visitor sees the update immediately.
- **AI auto-reply off by default**: When an agent claims a chat, AI auto-reply starts off so the agent handles the conversation solo. It can be turned back on at any time from the thread.
- **Accurate presence in the queue**: The queue shows "Live" only while the visitor is actively online, and "Away" if they have stepped away, so agents always see the correct status.
- **Visitor-left state in thread**: When a visitor leaves mid-chat, the thread shows a clear "visitor has left" notice with a Close button instead of an unresponsive composer.
- **Copilot answers render formatted**: AI Copilot answers and summaries now display with proper formatting including bullets, bold, code blocks, and line breaks.
- **Chat thread renders markdown**: Messages and AI suggestions in the support thread now show formatted text instead of raw markdown symbols.
- **AI suggestions suppressed when AI is co-replying**: Auto-generated reply suggestions are only produced when AI auto-reply is off, preventing duplicate responses appearing side by side.
- **Stale and orphaned handoffs cleared from queue**: Visitors who have been inactive for several minutes, and handoffs left over from unexpected restarts, are automatically removed from the live queue.
- **Support thread layout tidied**: Extra blank space below the message composer has been removed.
- **"Close this chat" danger styling**: The close button now uses a destructive style to reduce the chance of accidental closes.

### Server

- **Resolution email on close**: When an agent closes a live chat or email thread and the visitor's contact address is on record, the visitor automatically receives a branded confirmation that everything is wrapped up. Replying to the email reopens the thread.
- **Offline lead emails**: Visitors who leave a contact address when no agent is available receive a branded acknowledgement email, and the site owner and agents receive an alert that a lead is waiting.
- **One notification per offline session**: Repeating a handoff request while no agent is available no longer triggers multiple notification emails; only one is sent per offline session.
- **Polished transactional email design**: Notification emails now use a branded design with a gradient header, bold headline, and a clear call-to-action.
- **AI speaks as the business**: The AI now uses "we," "our," and "us" when referring to the business rather than detached phrases, giving responses a more natural and ownership-forward tone.

## 2026-06-07

### Widget

- **Fixed: form tasks no longer cancelled by natural answers**: typing a response in natural language (including mixed-language replies) no longer accidentally cancels or skips the current task mid-flow. Only a deliberate cancel or skip instruction stops the task.
- **Fixed: assistant keeps context across messages and reloads**: the assistant now maintains the full conversation throughout a session, resumes paused tasks correctly when you supply the requested information, and no longer re-asks what you want after a page reload or reconnection.

## 2026-06-06

### Dashboard

- **Cleaner sign-in experience**: the login and signup forms now sit on a plain background. The decorative glow effect and texture pattern that previously appeared behind the form card have been removed for a cleaner, more focused look.
- **Accurate mobile preview in Settings**: switching the widget preview to Mobile now captures your site at a real mobile width, so the preview reflects the actual mobile layout instead of a cropped desktop view. Both Desktop and Mobile snapshots are prepared up front with a progress indicator, so toggling between them is instant once they are ready.
- **Sharper desktop preview**: the desktop preview in Settings now renders at 2K (retina) resolution, so the screenshot stays crisp and detailed on high-density displays.
- **Desktop preview at natural proportions**: the desktop preview in Settings now captures at a Full HD viewport, so site text and layouts appear at the same proportions as on a real desktop monitor. Previously a narrower viewport caused text to look oversized in the preview.
- **Roomier mobile preview**: the mobile preview now uses a wider viewport matching a larger class of modern phones, giving previewed layouts more breathing room and a less cramped appearance.
- **Profile photo in dashboard**: your Google profile photo now appears as your avatar in the navigation sidebar, with your initial shown as a fallback when no photo is available.
- **AI & Behaviour tab in site navigation**: the AI & Behaviour settings now appear as a top-level tab in the site navigation, so you can reach assistant configuration directly without going through the Settings sub-tabs.
- **Re-fetch theme refreshes the live preview**: clicking "Re-fetch site theme" now also rebuilds the desktop and mobile preview screenshots, so the updated colors are visible in the preview panel immediately without leaving the page.
- **Profile photo on Account page**: your Google profile photo now appears on your Account page alongside your account details.
- **Crisper cards on light backgrounds**: dashboard cards now display a more defined shadow on light-mode backgrounds, so they stand out clearly rather than blending into the page.
- **Plan label corrected on Sites overview**: the Plan badge on your Sites overview now shows your actual plan (Pro, Studio, or "No plan" when unsubscribed) instead of always displaying "Free".
- **Crawl progress shows real page counts**: when a site is being scanned, the progress panel now displays "Found N pages" and a live "Scanning · X of N" count right away instead of sitting at zero while the first pages load. The bar fills as pages are discovered and completes when the scan finishes.

### Landing

- **Account menu in the site header**: when you are signed in, a personalized avatar and dropdown now appear in the navigation header with quick links to your dashboard, sites, analytics, billing, and settings.
- **Sign in and free trial from the mobile menu**: the hamburger menu on mobile now includes Sign in and Start free trial buttons, so visitors on phones can jump in without hunting for header controls.
- **Theme switcher in the mobile menu**: the light/dark/system selector has moved from the mobile header into the hamburger menu, keeping the header uncluttered on phones. Changing the theme from the drawer shows the result live without closing the menu.
- **Consistent theme across all pages**: your light, dark, or system preference now applies to the homepage, dashboard, sign-in, and docs in sync. A change in one part of the product is reflected everywhere instantly.
- **Opaque mobile menu**: the mobile navigation drawer is now fully solid, so page content no longer bleeds through behind the open menu.

### Billing

- **Native billing controls**: you can now see your card on file and cancel or resume your subscription directly on the Billing page, without being redirected to an external site. Card updates still open the secure payment portal.
- **Cleaner cancel confirmation**: cancelling a subscription now shows a focused dialog with details of what will change, replacing the basic browser prompt.
- **Trial is once per account**: the free trial applies to your first subscription only. Returning subscribers go straight to the paid plan without a repeated trial period.
- **Subscription status banner**: a dismissible banner in the app lets you know when your trial or subscription is nearing its end, and prompts you to reactivate if your plan has lapsed and your sites are paused.
- **Fixed: paid users shown as free after checkout**: accounts that had successfully paid were in some cases still treated as free or directed back to checkout. This has been corrected.
- **Fixed: billing management link always works**: the billing management link now reliably opens for all active subscribers, including accounts that completed payment recently.
- **Fixed: spinner no longer sticks after leaving checkout**: navigating back from the billing checkout page no longer leaves a stuck loading spinner on the billing button.
- **Fixed: post-upgrade redirect goes to dashboard**: completing an upgrade now takes you to your dashboard instead of the billing page.

## 2026-06-05

### Widget

- **Side-panel close polished**: closing the side panel now slides fully off screen in perfect sync with the page content returning to position. The close animation mirrors the open animation exactly, with no fade or lag.
- **Smarter "what's new" answers**: asking the AI what changed or what's new now returns a real synthesized answer from the visible content, instead of a list of dates with a follow-up question about which one you meant.
- **Dark theme colors corrected**: the widget now correctly receives and applies your site's dark background color, so visitors on dark-themed sites see the right look straight away.
- **Minimal nudge wraps correctly**: the "minimal" nudge tooltip now sizes itself to its message text and wraps at a natural width, instead of collapsing into a narrow sliver of one word per line.
- **Side-panel works on full-screen layouts**: the side-panel now correctly shifts page content aside on sites where the entire page is rendered as a full-screen fixed wrapper, such as single-page apps and interactive portfolio sites. Content no longer slides behind the open panel.
- **Live progress updates**: the agent now shows what it is doing during multi-step tasks instead of displaying a frozen spinner, so visitors can follow along as it navigates, clicks, and fills in forms.
- **Long list responses collapse**: when the agent replies with more than eight list items, the extra entries tuck away behind a "Show N more" button, keeping the chat readable without hiding detail.
- **Keyboard interaction**: the agent can now press keys such as Enter, Escape, Tab, and arrow keys to close modals, submit forms with keyboard shortcuts, and navigate keyboard-driven menus on your site.
- **Hover reveals hidden menus**: the agent can now hover over elements to open dropdown menus, submenus, and tooltips that only appear on hover. After hovering, it re-scans the page and clicks the newly revealed items, so nested hover-only navigation is now fully supported.
- **Double-click support**: the agent can now double-click elements on sites that require it, such as file-tree nodes or inline editors.
- **Button labels stay accurate**: call-to-action buttons generated by the assistant now clip only at word boundaries and show a "..." suffix, so a truncated label can only read as shortened, never as a different or opposite word.
- **Scroll targets stay fully visible**: when the agent scrolls to a heading or section, it now positions the target with a small gap at the top of the screen so the content is never clipped at the viewport edge.

### Dashboard

- **Re-fetch site theme**: new button in Settings, Appearance lets you pull fresh brand colors from your site after a redesign, updating the widget instantly without triggering a full re-crawl.
- **Smarter brand color detection**: the auto-detected widget color now reads from your site's actual accent surfaces such as buttons, links, call-to-action elements, icons, and CSS accent variables, not just backgrounds. Dark sites and accent-forward designs now get the right color automatically. The "Re-fetch site theme" button also reliably refreshes the color after a redesign, even when a color was previously auto-detected.
- **Settings preview matches the real side-panel**: the widget preview in Settings now shows the side-panel as a true docked drawer that pushes the page content left, matching exactly how visitors see it. The preview backdrop slides aside as the panel opens and returns when it closes, so you get an accurate picture of the final look before saving.
- **Brand color accuracy refined**: the auto-detected brand color now skips very dark and very near-white shades, so only real accent tones are chosen. Sites where a dark surface like a navigation bar was being selected as the brand color will now get the correct accent color automatically.
- **AI and Behaviour settings**: a new tab in Settings gives you full control over how the assistant presents itself. Set a name, persona, and tone, write custom instructions, build a library of question-and-answer pairs, add knowledge snippets for accurate responses, and configure guardrails to keep conversations on topic. Changes are reflected on live widgets within seconds.
- **Custom Q&A takes priority**: configured Q&A answers now reliably override any conflicting information detected from your site, so visitors always receive the exact response you wrote.
- **Regex patterns in path guardrails**: path restrictions now accept regular expressions in addition to plain text strings, giving you precise control over which pages the assistant is allowed to navigate to.

### Server

- **Smarter knowledge retrieval**: the assistant now finds answers by understanding the meaning of a visitor's question, not just by matching exact words. Asking "how much does it cost?" now surfaces your pricing content even when your page uses words like "fee", "plan", or "subscription" instead of "cost".
- **Deeper context on large sites**: on sites with many pages, the assistant now pulls in more relevant pages before answering, so visitors get accurate answers even when similar topics appear across dozens or hundreds of pages.
- **Clarifying questions instead of guesses**: when a visitor's request could match several different pages or actions and nothing clearly resolves it, the assistant now asks one short clarifying question instead of picking the wrong destination. Clear, specific requests are still answered directly.
- **Site-specific facts never invented**: prices, hours, policies, contact details, and other facts specific to your site now come strictly from your site content. General knowledge may supplement an answer but never overrides or replaces what your site says.

### Landing

- **Demo showcase plays each animation in full**: the feature demos on the homepage now wait for each animation to complete before advancing to the next one, so longer sequences like the form-fill run to the end. All demo tabs now play correctly.

## 2026-06-04

### Widget

- **Side-panel blends into your site** — the side-panel drawer now samples your page's background colour right at its edge and adopts it as its own surface, re-tinting smoothly as visitors scroll past differently-coloured sections. The old hard drop-shadow is gone, replaced by a hairline left border in a tone derived from your site — so the panel reads as a native part of the page, not a floating slab.
- **Sharper on dark themes** — on dark sites the floating + bottom-bar widget surfaces now lift to a slightly lighter tone derived from your page background, so the widget stands out as raised chrome instead of melting into a dark background. Fully automatic, per-site.
- **Switch layouts from the chat header** — visitors can flip the widget between floating, bottom-bar, and side-panel on the fly using icon buttons in the header. Their choice persists across reloads (along with the open/closed state). Admins who want a fixed layout can turn on the new **Lock layout** option to hide the switcher.
- **Mobile is always floating** — on phones (≤ 640px) the widget renders as the floating bubble (full-screen sheet on open) no matter which layout you picked; the layout switcher is hidden there. Side-panel and bottom-bar stay desktop-only. Your desktop layout is unchanged.
- **Smoother side-panel close** — the drawer slides out to mirror its open, stays full-width through the animation, and the page content glides back in sync — no mid-animation shrink, no jerk.

### Dashboard

- **Lock layout** — Settings → Appearance → Layout. When on, visitors can't switch layouts from the chat header and every reload keeps your chosen layout.
- **Settings apply instantly** — saving widget settings (color, greeting, layout, lock, launcher) now busts the server-side config cache immediately, so live widgets reflect the change on the next page load instead of up to ~15s later.
- **Transfer a site to another account** — Settings → Danger → **Transfer site**. Enter the destination account's email (verified live before you commit) and ownership moves over instantly; the widget keeps serving with no interruption or re-crawl.
- **Live preview auto-opens** — switching the widget layout in Settings now opens the live preview in that layout immediately, so you see the change without a manual click.

## 2026-05-27

### Widget

- **`window.LeFlux` public API shipped** — open / close / toggle / send / ask / setVisitorData / clearConversation / dock / undock / showLauncher / reindex / destroy, plus state getters (`isReady` / `isOpen` / `isExpanded` / `getState` / `getLanguage` / `getSessionId`). Backwards-compat: `window.AIChatWidget` still exists as the underlying instance.
- **Granular event stream** — added `leflux:state-change`, `leflux:typing-start` / `:typing-end`, `leflux:expand` / `:collapse`, `leflux:navigating`, `leflux:language-detected`, `leflux:destroy` to the existing `leflux:ready` / `:open` / `:close` / `:message` / `:reply` / `:action` / `:task_complete` / `:error` set.
- **Conversation state machine** — single source of truth (`idle` / `typing` / `processing` / `navigating` / `awaiting-input`) exposed via `LeFlux.getState().conversation` and the `state-change` event. Drives analytics + custom UI.
- **Hide launcher mode** — new dashboard toggle (Settings → Launcher → "Hide launcher button"). Widget mounts + stays connected; the floating button is invisible. Chat opens only via `window.LeFlux.open()` from your own UI.
- **Log discipline** — `[LeFlux]` console logs are now silent on customer production hostnames. Enable on prod for support cases by adding `data-debug="true"` to the embed `<script>`. Errors always remain loud.

### Server

- **Language on every payload** — `message_done`, `message`, `action_plan`, `task_complete` now carry a normalized `language` slug (`'en'`, `'roman-urdu'`, `'de'`, …) so client-side `LeFlux.getLanguage()` is always fresh.

## 2026-05-26

- **Developer docs site** launched at [/docs](https://leflux.ai/docs/). Searchable, dark + light mode, full coverage of installation, configuration, features, API.

## 2026-05-25

### Widget

- **Floating composer redesign** — input pill now lives INSIDE the chat-window (was a separate bar below on bottom-bar layout). Unified surface across docked + floating modes.
- **Ultra-thin header** — replaced solid purple banner with glassmorphic blended bar (~50px tall, was ~70). Header now reads as part of the panel, not a marketing slab.
- **Modern input field** — sparkle icon prefix (themed to primary color), Enter ↵ kbd hint, rounded square send button with glossy hover sweep, transparent surround so messages flow seamlessly behind the pill.
- **Configurable launcher** — shape (circle/squircle/pill), size (sm/md/lg), icon (chat/sparkle/question/lightning/cursor), position offset, glow toggle. All from the dashboard.
- **Nudge messages** — optional proactive tooltip near the launcher. Styles: bubble, card, minimal. 24h dismissal cooldown. Renders on all three layouts (floating, bottom-bar, side-panel).
- **Dock side-panel mode** — true side drawer with host body push, fixed-element shifting (nav bars repositioned to clear the panel), seamless input + scroll handling.
- **Required field detection** — indexedElements now expose `required: true` for inputs with native required / aria-required. Form-fill never skips a required field.
- **Focus preservation** — input stays focused after every assistant message + action sequence. Visitor can keep typing without clicking back.

### Server

- **AI-visible state trace** — after every action, the LLM sees `[state]` block in the next prompt with URL diff + plain-English next-step instructions when the action was a no-op.
- **Knowledge-base ULTRA-HIGH priority** — every turn the LLM scans Site contacts (emails + phones), Page text excerpts (up to 2500 chars per page), Summary, Headings, Notes, and Sitemap before deciding an action.
- **Three-equal navigation paths** — `navigate`, `click`, `scroll_to` are now equally weighted in the decision tree. Bot picks based on situational fit, not hardcoded preference.
- **Cross-page anchor handling** — anchor links (`#contact`) only work on the page they live on; bot now navigates to `/pathname#anchor` for cross-page anchor targets.
- **Loop guards** — same-click 3x, same-navigate 2x, scroll-only 3x → break the loop with honest summary + clarifying question. Never silently emits "Done" when nothing happened.
- **Assistant message dedup** — server suppresses repeated assistant text against the most recent history entry. No more "Fahad ko hire karne ke liye…" × 3.
- **Crawler heartbeat reaper** — stale crawl jobs (no heartbeat for 60s) auto-marked failed. No more "scanning…" forever.
- **Contact extraction** — crawler scans all pages for emails + phone numbers; prepended as a `## Site contacts` block at the top of the LLM prompt.

### Dashboard

- **Dashboard redesign** — modernized cards, sticky sidebar with active-nav highlighting.
- **Live crawl panel** — real-time progress (pages discovered, walked, current URL).
- **Launcher + Nudge configurators** — full UI for all the per-site widget chrome.
- **Empty session cleanup** — dashboard hides + server stops writing empty sessions to DB.

## 2026-05-23

- **LeFlux Cloud MVP** shipped. Multi-tenant: users → orgs → sites. Per-site config (color, layout, allowed hosts), site crawler, embed.js zero-config loader.
- **Faster model pipeline** — sub-second first-token latency.

## 2026-05-15

- **Universal indexing** rolled out — agent now references elements by numeric id, not selectors. Works on any site without per-tenant rules.

## 2026-04-15

- **Iterative loop** — agent now takes multiple turns per visitor message. Tasks like form-fill complete autonomously.

## 2026-04-03

- **Initial public release** — basic chat widget. Server, widget bundle, embed.js loader.

---
