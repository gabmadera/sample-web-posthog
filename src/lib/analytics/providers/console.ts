import type { AnalyticsProvider } from "../types";

/** Dev proof-of-life: shows in the console what every real SDK would receive. */
export const consoleProvider: AnalyticsProvider = {
  name: "console",
  track: (event, props) => console.info("[analytics] track", event, props ?? {}),
  identify: (userId, traits) =>
    console.info("[analytics] identify", userId, traits ?? {}),
  page: (path, props) => console.info("[analytics] page", path, props ?? {}),
  reset: () => console.info("[analytics] reset"),
};
