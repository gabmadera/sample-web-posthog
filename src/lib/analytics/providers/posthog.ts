import posthog from "posthog-js";
import type { AnalyticsProvider } from "../types";

/**
 * PostHog Web (posthog-js). Automatic pageview capture is disabled so the
 * facade's page() drives pageviews — every SDK on this site must receive the
 * same inputs for a fair comparison.
 */
export const posthogProvider: AnalyticsProvider = {
  name: "posthog",
  init: () => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      defaults: "2026-05-30",
      person_profiles: "identified_only",
      capture_pageview: false,
      session_recording: {
        // Inputs are masked by default; this also masks rendered text carrying
        // the site's PII convention (e.g. the account page's email display).
        maskTextSelector: ".pii-field",
      },
    });
  },
  track: (event, props) => posthog.capture(event, props),
  identify: (userId, traits) => posthog.identify(userId, traits),
  // $current_url is attached automatically; listener fires after the URL change.
  page: (path, props) => posthog.capture("$pageview", props),
  reset: () => posthog.reset(),
};
