export type EventProps = Record<string, string | number | boolean | null>;

export type UserTraits = Record<string, string | number | boolean | null>;

/**
 * One vendor SDK = one provider implementing this interface, registered in
 * lib/analytics/index.ts. Site code never imports a vendor SDK directly.
 */
export interface AnalyticsProvider {
  name: string;
  /** Called once, lazily, in the browser before the first event. */
  init?: () => void;
  track: (event: string, props?: EventProps) => void;
  identify: (userId: string, traits?: UserTraits) => void;
  page: (path: string, props?: EventProps) => void;
  reset: () => void;
}
