"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-deep",
  secondary:
    "border border-ink-300 bg-white text-navy hover:border-accent hover:text-accent-deep",
  ghost: "text-accent-deep hover:bg-accent-100",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-headline text-sm font-medium",
        "transition-[background-color,border-color,color,transform] duration-150 ease-out-strong active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
