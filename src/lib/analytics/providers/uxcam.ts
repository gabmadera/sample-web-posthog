import type { AnalyticsProvider, EventProps, UserTraits } from "../types";

interface UxcApi {
  __t: unknown[];
  __ak: string;
  __o: Record<string, unknown>;
  event: (name: string, props?: EventProps) => void;
  setUserIdentity: (id: string) => void;
  setUserProperty: (key: string, value: unknown) => void;
  setUserProperties: (props: UserTraits) => void;
}

declare global {
  interface Window {
    uxc?: UxcApi;
  }
}

/**
 * UXCam Web SDK, loaded via the official stub (queues calls until the script
 * arrives, then replays them). Page visits, clicks, and scrolls are captured
 * automatically (URL-based), so page() needs no manual call.
 */
export const uxcamProvider: AnalyticsProvider = {
  name: "uxcam",
  init: () => {
    const appKey = process.env.NEXT_PUBLIC_UXCAM_KEY!;
    window.uxc = {
      __t: [],
      __ak: appKey,
      __o: {
        appVersion: "1.0.0",
      },
      event(name, props) {
        this.__t.push(["event", name, props]);
      },
      setUserIdentity(id) {
        this.__t.push(["setUserIdentity", id]);
      },
      setUserProperty(key, value) {
        this.__t.push(["setUserProperty", key, value]);
      },
      setUserProperties(props) {
        this.__t.push(["setUserProperties", props]);
      },
    };
    const script = document.createElement("script");
    script.src = "//websdk-recording.uxcam.com/index.js";
    script.async = true;
    script.defer = true;
    script.id = "uxcam-web-sdk";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  },
  track: (event, props) => window.uxc?.event(event, props),
  identify: (userId, traits) => {
    window.uxc?.setUserIdentity(userId);
    if (traits) window.uxc?.setUserProperties(traits);
  },
  page: () => {
    // URL-based page visits are captured automatically by the web SDK.
  },
  reset: () => {
    // The web SDK has no client-side reset; identity is per-install/browser.
  },
};
