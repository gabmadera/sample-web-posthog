# Northlight — SDK Showcase Site

A fake smart-lighting storefront (Next.js App Router + Tailwind v4, UXCam-branded) built as a
test-bed for web analytics & monitoring SDKs — UXCam Web, PostHog, Sentry, etc.

Every feature exists to exercise SDK capabilities: multi-page navigation (SPA + one deliberate
hard load), a product → cart → checkout funnel, PII fields for occlusion testing (`.pii-field`),
a fake login that drives `identify()`/`reset()`, video/carousel/long-scroll replay stress, and
validated forms emitting error events.

All instrumentation goes through the adapter facade in `src/lib/analytics/` — in dev, events
also print to the browser console as `[analytics] …`. Integrated providers: **PostHog** (EU
cloud, active) and **UXCam Web** (activates once `NEXT_PUBLIC_UXCAM_KEY` is set). Adding another
SDK = one provider file implementing `AnalyticsProvider` + registering it behind an env var —
see `.env.example`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## Verify

```bash
npx tsc --noEmit && npm run lint && npm run build
```

See `CLAUDE.md` for architecture details and `docs/plans/2026-08-11-showcase-site-design.md`
for the design doc.
