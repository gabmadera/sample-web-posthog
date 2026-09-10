# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

"Northlight" — a fake smart-lighting storefront that exists as an **SDK test-bed for CSE work**.
Every feature was chosen to exercise analytics/monitoring SDKs (UXCam Web, PostHog, Sentry, …):
session replay, event capture, PII occlusion, identify/reset, funnels, SPA vs hard navigation.
Design doc: `docs/plans/2026-08-11-showcase-site-design.md`.
Deployed to GitHub Pages at https://gabmadera.github.io/sample-web-posthog/ on every push to
`main` (repo `gabmadera/sample-web-posthog`).

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npx tsc --noEmit && npm run lint && npm run build` — the verify loop; all three must pass
- No test runner is configured.

## Architecture

**Analytics facade (the core pattern).** Site code never imports a vendor SDK. Everything goes
through `src/lib/analytics/index.ts` (`track` / `identify` / `page` / `reset`), which fans out over
a `providers[]` registry of `AnalyticsProvider` implementations (`src/lib/analytics/types.ts`).
Dev builds register a console logger — open devtools and every event prints as `[analytics] …`.
**To add an SDK:** create `src/lib/analytics/providers/<vendor>.ts` implementing the interface,
register it in `index.ts` behind a `NEXT_PUBLIC_*` env var. Zero call-site changes.
`page()` fires automatically on every route change via `AnalyticsListener` in the root layout.

**Registered providers** (each activates only when its key is set — locally in `.env.local`, in
CI via GitHub Actions repo *variables* consumed by `.github/workflows/deploy.yml`):
- **PostHog** (`providers/posthog.ts`, `NEXT_PUBLIC_POSTHOG_KEY` + `_HOST`, EU cloud):
  posthog-js with `capture_pageview: false` — the facade's `page()` sends `$pageview` so every
  SDK receives identical inputs. Replay masking via `maskTextSelector: ".pii-field"`; the
  recorder only runs if session replay is enabled in the PostHog project settings.
- **LogRocket** (`providers/logrocket.ts`, `NEXT_PUBLIC_LOGROCKET_APP_ID` — an `org/app` slug, set
  locally in `.env.local` and in CI as a repo variable; the same LogRocket app as the Flutter
  demo, so web and mobile sessions sit side by side):
  the `logrocket` npm SDK. Navigation is captured automatically from history changes, so
  `page()` only adds a `$pageview` breadcrumb to keep the timeline aligned with the other SDKs.
  `reset()` maps to `startNewSession()` — web has no identity reset. Occlusion is kept at
  parity with PostHog via `dom.inputSanitizer` + `dom.redactSelectors: [".pii-field"]`
  (verified: typed `.pii-field` values never reach either recorder's payloads; the email that
  does appear is the deliberate `identify()` user id). LogRocket's traits/params reject `null`,
  which the facade allows, so the provider drops null keys rather than coercing them.
- **UXCam Web** (`providers/uxcam.ts`, `NEXT_PUBLIC_UXCAM_KEY` — **pending, not yet issued**):
  official stub queue + script from `websdk-recording.uxcam.com`. Page visits are auto-captured
  (URL-based) so `page()` is a no-op; there is no client-side `reset()` on web. Integration
  guides come from the Tara MCP (`get_sdk_guide(platform="web", topic=…)`) — use it, don't
  guess. Verification after the key lands: `verify_integration` handshake, then
  `validate_instrumentation` with a pre-run UTC `since` (rung 2), and occlusion QA via
  `verify_web_occlusion` — never `analyze_session_video` on web.

**Canonical events** (grep for `track(`): `cta_click`, `product_clicked`, `product_viewed`,
`quick_view_opened`, `add_to_cart` (with `source: grid|quick_view|detail`), `cart_item_removed`,
`checkout_started`, `checkout_completed`, `form_error` (field **names** only, never values),
`login`, `logout`, `contact_submitted`, `video_play`/`video_pause`, `carousel_navigated`.

**Occlusion targets.** Elements holding PII (emails, password, address + card fields on
`/checkout`, `/account`, `/contact`) carry BOTH markers, and any new PII element must too
(the checkout *name* field is deliberately left unoccluded as a control for occlusion QA):
`class="pii-field"` (PostHog `maskTextSelector`, plus the documented convention) and
`data-uxc="obfuscated"` (UXCam Web per-element occlusion). UXCam also auto-occludes
`type=email/password/tel/number` inputs; the markers make masking explicit and vendor-agnostic.

**Page → scenario map:** `/` marketing + scroll reveals · `/products` grid + native-`<dialog>`
quick view · `/products/[id]` SSG detail + clip-path tabs · `/cart` → `/checkout` funnel with
fake card form · `/account` fake login driving `identify()`/`reset()` (any password works) ·
`/media` video, snap carousel, long scroll · `/contact` validated form. The footer "Contact
(full page load)" link is a deliberate `<a>` hard navigation — SDKs differ on SPA vs full loads.

**Client state.** `src/lib/local-store.ts` is a localStorage-backed external store consumed via
`useSyncExternalStore` (SSR renders the fallback, client swaps after hydration — do NOT replace
with setState-in-effect hydration; the `react-hooks/set-state-in-effect` lint rule blocks it).
Cart (`src/lib/cart.tsx`) and the account user both sit on it.

## Styling & motion conventions

- UXCam brand tokens live in `src/app/globals.css` under `@theme`: navy `#161E35` (`bg-navy`),
  accent blue `#5D97FF` (`bg-accent`, hover `accent-deep`), gray scale `ink-100…700`.
  Poppins = headlines (`font-headline`, auto-applied to h1–h4), Roboto = body. Element defaults
  must stay inside `@layer base` and the font tokens inside `@theme inline` — moving either
  breaks utility overrides / makes fonts silently fall back to system.
- Animation decisions follow Emil Kowalski's skills in `.claude/skills/` (`animate`,
  `review-animations`, `pick-ui-library`) — use them for any motion or component-choice work.
  House rules already applied: custom easings `ease-out-strong`/`ease-in-out-strong` (never
  `ease-in`, never `scale(0)`, UI transitions ≤300ms, `prefers-reduced-motion` variants ship with
  every animation). Toasts are Sonner; conditional classes use clsx; no other UI kit — the DOM is
  kept simple on purpose for replay fidelity.

## Gotchas

- React StrictMode double-fires effects in dev, so `page`/`product_viewed` events log twice —
  dev-only, not a bug; prod builds fire once.
- Data is all mock/local (`src/lib/catalog.ts`, localStorage). There is no backend; checkout and
  login are visual-only by design. Don't "fix" that.
