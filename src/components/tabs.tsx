"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

export interface Tab {
  label: string;
  content: ReactNode;
}

/**
 * Segmented tabs. The active state is a duplicated, clipped copy of the tab
 * list so text and background swap in perfect sync (Emil's clip-path recipe).
 */
export function Tabs({
  tabs,
  onChange,
}: {
  tabs: Tab[];
  onChange?: (label: string) => void;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const copy = copyRef.current;
    if (!list || !copy) return;

    const measure = () => {
      const btn = list.children[active] as HTMLElement | undefined;
      if (!btn) return;
      const right = list.clientWidth - btn.offsetLeft - btn.offsetWidth;
      copy.style.clipPath = `inset(4px ${right}px 4px ${btn.offsetLeft}px round 8px)`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  const buttons = (interactive: boolean) =>
    tabs.map((tab, i) => (
      <button
        key={tab.label}
        type="button"
        tabIndex={interactive ? 0 : -1}
        aria-hidden={!interactive}
        className={clsx(
          "flex-1 rounded-lg px-4 py-2 font-headline text-sm font-medium",
          interactive ? "text-ink-500" : "text-white",
        )}
        onClick={
          interactive
            ? () => {
                setActive(i);
                onChange?.(tab.label);
              }
            : undefined
        }
      >
        {tab.label}
      </button>
    ));

  return (
    <div>
      <div className="relative rounded-xl bg-ink-100 p-1">
        <div ref={listRef} className="flex">
          {buttons(true)}
        </div>
        <div
          ref={copyRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex bg-navy p-1 transition-[clip-path] duration-[250ms] ease-in-out-strong motion-reduce:transition-none"
        >
          {buttons(false)}
        </div>
      </div>
      <div className="pt-5">{tabs[active].content}</div>
    </div>
  );
}
