"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

/** Reveals children once when they enter the viewport. Marketing surfaces only. */
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={clsx("reveal", className)}>
      {children}
    </div>
  );
}
