import type { AnalyticsProvider, EventProps, UserTraits } from "./types";
import { consoleProvider } from "./providers/console";
import { logRocketProvider } from "./providers/logrocket";
import { posthogProvider } from "./providers/posthog";
import { uxcamProvider } from "./providers/uxcam";

const providers: AnalyticsProvider[] = [];

if (process.env.NODE_ENV === "development") {
  providers.push(consoleProvider);
}

// NEXT_PUBLIC_* vars are inlined at build time — a missing key means the
// provider never registers and the site runs without that SDK.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  providers.push(posthogProvider);
}
if (process.env.NEXT_PUBLIC_UXCAM_KEY) {
  providers.push(uxcamProvider);
}
if (process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  providers.push(logRocketProvider);
}

let initialized = false;

function fanOut(fn: (p: AnalyticsProvider) => void) {
  if (typeof window === "undefined") return;
  if (!initialized) {
    initialized = true;
    for (const p of providers) {
      try {
        p.init?.();
      } catch (err) {
        console.error(`[analytics] init failed for ${p.name}`, err);
      }
    }
  }
  for (const p of providers) {
    try {
      fn(p);
    } catch (err) {
      // One broken SDK must never take down the others or the site.
      console.error(`[analytics] ${p.name} call failed`, err);
    }
  }
}

export function track(event: string, props?: EventProps) {
  fanOut((p) => p.track(event, props));
}

export function identify(userId: string, traits?: UserTraits) {
  fanOut((p) => p.identify(userId, traits));
}

export function page(path: string, props?: EventProps) {
  fanOut((p) => p.page(path, props));
}

export function reset() {
  fanOut((p) => p.reset());
}
