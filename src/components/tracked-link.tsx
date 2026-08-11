"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";
import type { EventProps } from "@/lib/analytics/types";

/** next/link that fires an analytics event on click. */
export function TrackedLink({
  event,
  eventProps,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { event: string; eventProps?: EventProps }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
