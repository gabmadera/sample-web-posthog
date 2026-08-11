# SDK Showcase Site — Design

**Date:** 2026-08-11
**Status:** Approved (brainstormed with Gabriel)

## Purpose

An SDK test-bed for CSE work: a realistic, UXCam-styled Next.js site whose features exist to
exercise analytics/monitoring SDKs (UXCam Web, PostHog, Sentry, …) side by side — session replay,
event capture, occlusion, identify flows. **No SDKs in v1**; the site ships with a clean
instrumentation abstraction so each SDK lands later as one adapter file + env vars.

## Stack

- Next.js (App Router) + TypeScript + Tailwind v4, scaffolded with `create-next-app`
- Fonts: Poppins (headlines) + Roboto (body) via `next/font` — UXCam brand
- Colors: UXCam palette (navy `#161E35`, accent blue `#5D97FF`, gray scale) as Tailwind theme tokens
- Motion: CSS transitions/`@starting-style` first; `motion` only where interruptibility matters
- Toasts: Sonner. Classnames: clsx. No other UI kit — simple DOM for replay/occlusion testing
- Emil Kowalski's animation skills installed at `.claude/skills/` drive all motion decisions

## Pages → SDK scenarios

| Route | Purpose | Exercises |
| --- | --- | --- |
| `/` | Marketing home: hero, feature cards, CTA | page views, scroll depth, CTA clicks |
| `/products` | Product grid (~8 mock items) | list clicks, click-through events |
| `/products/[id]` | Detail + tabs + Add to cart | dynamic routes, funnel step |
| `/cart` → `/checkout` | Cart summary → checkout form with **card fields** | funnel completion, form tracking, **PII occlusion** |
| `/account` | Fake login/signup + profile | `identify()` / `reset()` |
| `/media` | Video, carousel, lazy images, long scroll | replay fidelity, scroll/visibility events |
| `/contact` | Validated form, success/error states | form analytics, validation-error events |

All data local/mock: `lib/catalog.ts` static products; cart in React context + localStorage.
Card fields are visual-only inputs that exist as occlusion targets. Nav uses `<Link>` (SPA
transitions) plus at least one deliberate full-page `<a>` load — SDKs differ on SPA vs hard nav.

## Instrumentation layer (adapter facade)

```
src/lib/analytics/
  types.ts        AnalyticsProvider interface: init / track / identify / page / reset
  index.ts        facade: track(), identify(), page(), reset() → fan out over providers[]
  providers/
    console.ts    dev proof-of-life logger (always on in dev)
    posthog.ts    ← later
    uxcam.ts      ← later
```

- Site code imports **only** the facade; never a vendor SDK directly.
- `<AnalyticsListener>` client component fires `page()` on every route change.
- Canonical events: `cta_click`, `product_viewed`, `add_to_cart`, `checkout_started`,
  `checkout_completed`, `login`, `logout`, `video_play`, `form_error`, `contact_submitted`.
- Adding an SDK later = new provider file implementing the interface + env var to enable it.

## Verify loop

`npx tsc --noEmit` && `npm run lint` && `npm run build`; `npm run dev` on :3000 for manual checks.
