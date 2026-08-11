"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

function CartBadge() {
  const { count } = useCart();
  const [pop, setPop] = useState(false);
  const prev = useRef(count);

  // Feedback pop when the count changes; transition (not keyframes) so rapid
  // adds retarget instead of restarting.
  useEffect(() => {
    if (count === prev.current) return;
    prev.current = count;
    setPop(true);
    const t = setTimeout(() => setPop(false), 150);
    return () => clearTimeout(t);
  }, [count]);

  if (count === 0) return null;

  return (
    <span
      className={clsx(
        "absolute -top-1.5 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-headline text-[11px] font-semibold text-white",
        "transition-transform duration-150 ease-out-strong motion-reduce:transition-none",
        pop ? "scale-125" : "scale-100",
      )}
    >
      {count}
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-headline text-lg font-bold text-navy">
          north<span className="text-accent">light</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                  active
                    ? "font-medium text-accent-deep"
                    : "text-ink-500 hover:bg-ink-100 hover:text-navy",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className={clsx(
              "rounded-md px-3 py-2 text-sm transition-colors duration-150",
              pathname.startsWith("/account")
                ? "font-medium text-accent-deep"
                : "text-ink-500 hover:bg-ink-100 hover:text-navy",
            )}
          >
            Account
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-md px-3 py-2 text-sm text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-navy"
          >
            Cart
            <CartBadge />
          </Link>
        </div>
      </nav>
    </header>
  );
}
