import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-headline text-lg font-bold">
            north<span className="text-accent">light</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-ink-300">
            A demo storefront built to exercise analytics and monitoring SDKs —
            replay, events, occlusion, identify.
          </p>
        </div>
        <div>
          <p className="font-headline text-sm font-semibold text-accent-200">
            Shop
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-300">
            <li>
              <Link href="/products" className="hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-headline text-sm font-semibold text-accent-200">
            Company
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-300">
            <li>
              <Link href="/media" className="hover:text-white">
                Media
              </Link>
            </li>
            <li>
              {/* Deliberate hard navigation (<a>, not <Link>): SDKs handle full
                  page loads differently from SPA route changes. Plain <a> hrefs
                  bypass Next's basePath, so it's prefixed manually. */}
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/contact/`}
                className="hover:text-white"
              >
                Contact (full page load)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-400 sm:px-6">
          © 2026 Northlight. Not a real store — an SDK test-bed.
        </p>
      </div>
    </footer>
  );
}
