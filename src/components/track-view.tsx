"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { EventProps } from "@/lib/analytics/types";

/** Fires one analytics event when the surface mounts (e.g. product_viewed). */
export function TrackView({
  event,
  eventProps,
}: {
  event: string;
  eventProps?: EventProps;
}) {
  useEffect(() => {
    track(event, eventProps);
    // Intentionally fire-on-mount only; props are stable per page instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
