import LogRocket from "logrocket";
import type { AnalyticsProvider, EventProps, UserTraits } from "../types";

/**
 * LogRocket's traits and event params reject null, which the facade allows.
 * Dropping the key is closer to the other SDKs than coercing null to "null".
 */
function withoutNulls(
  props?: EventProps | UserTraits,
): Record<string, string | number | boolean> | undefined {
  if (!props) return undefined;
  return Object.fromEntries(
    Object.entries(props).filter(([, v]) => v !== null),
  ) as Record<string, string | number | boolean>;
}

/**
 * LogRocket Web (logrocket). Navigation is captured automatically from history
 * changes, so page() only tags the route — the facade still drives track() and
 * identify() so every SDK on this site receives the same inputs.
 *
 * Occlusion is kept at parity with PostHog: inputs are sanitized, and the
 * site's `.pii-field` convention is redacted in the replay.
 */
export const logRocketProvider: AnalyticsProvider = {
  name: "logrocket",
  init: () => {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!, {
      dom: {
        inputSanitizer: true,
        redactSelectors: [".pii-field"],
      },
    });
  },
  track: (event, props) => LogRocket.track(event, withoutNulls(props)),
  identify: (userId, traits) => LogRocket.identify(userId, withoutNulls(traits)),
  page: (path) => {
    // History changes are captured automatically; a breadcrumb keeps the
    // route visible in the session timeline next to the other SDKs' pageviews.
    LogRocket.track("$pageview", { path });
  },
  // Web has no identity reset; the closest equivalent is cutting the session.
  reset: () => LogRocket.startNewSession(),
};
