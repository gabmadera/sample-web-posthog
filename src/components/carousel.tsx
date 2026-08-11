"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "@/components/button";
import { track } from "@/lib/analytics";

/** Scroll-snap carousel; prev/next scroll one viewport at a time. */
export function Carousel({
  slides,
  label,
}: {
  slides: { id: string; node: ReactNode }[];
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
    track("carousel_navigated", {
      carousel: label,
      direction: direction === 1 ? "next" : "prev",
    });
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        aria-label={label}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-xl"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full shrink-0 snap-center">
            {slide.node}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          variant="secondary"
          aria-label="Previous slide"
          onClick={() => scrollBy(-1)}
        >
          ←
        </Button>
        <Button
          variant="secondary"
          aria-label="Next slide"
          onClick={() => scrollBy(1)}
        >
          →
        </Button>
      </div>
    </div>
  );
}
