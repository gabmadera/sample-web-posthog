"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { page } from "@/lib/analytics";

/** Fires a page() call on the initial load and every client-side route change. */
export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    page(pathname);
  }, [pathname]);

  return null;
}
