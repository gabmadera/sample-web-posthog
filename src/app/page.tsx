import { ScrollReveal } from "@/components/scroll-reveal";
import { TrackedLink } from "@/components/tracked-link";
import { ProductTile } from "@/components/product-card";
import { products, formatPrice } from "@/lib/catalog";

const features = [
  {
    emoji: "🏠",
    title: "Local-first",
    body: "Automations run on the hub in your home, not a datacenter. Everything keeps working when the internet doesn't.",
  },
  {
    emoji: "🌗",
    title: "Adaptive light",
    body: "Color temperature follows the sun and your schedule — warm mornings, focused afternoons, calm evenings.",
  },
  {
    emoji: "🔋",
    title: "Years of battery",
    body: "Thread-native sensors and switches sip power. Change batteries when you repaint, not every season.",
  },
  {
    emoji: "🔒",
    title: "Private by design",
    body: "No accounts required, no cloud dependency, no telemetry you didn't ask for. Your home stays yours.",
  },
];

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="rise-in font-headline text-sm font-medium tracking-wide text-accent uppercase">
            Smart lighting, done quietly
          </p>
          <h1
            className="rise-in mt-4 max-w-2xl font-headline text-4xl font-bold text-white sm:text-6xl"
            style={{ "--rise-index": 1 } as React.CSSProperties}
          >
            Light that thinks, so you don&apos;t have to.
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-lg text-ink-300"
            style={{ "--rise-index": 2 } as React.CSSProperties}
          >
            Northlight builds lamps, bulbs, and sensors that adapt to your day —
            locally, privately, beautifully.
          </p>
          <div
            className="rise-in mt-10 flex flex-wrap gap-3"
            style={{ "--rise-index": 3 } as React.CSSProperties}
          >
            <TrackedLink
              href="/products"
              event="cta_click"
              eventProps={{ cta: "hero_shop" }}
              className="rounded-lg bg-accent px-6 py-3 font-headline text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out-strong hover:bg-accent-deep active:scale-[0.97]"
            >
              Shop the collection
            </TrackedLink>
            <TrackedLink
              href="/media"
              event="cta_click"
              eventProps={{ cta: "hero_media" }}
              className="rounded-lg border border-white/25 px-6 py-3 font-headline text-sm font-medium text-white transition-[border-color,background-color,transform] duration-150 ease-out-strong hover:border-accent hover:bg-white/5 active:scale-[0.97]"
            >
              See it in motion
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-semibold">
            Why Northlight
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-ink-500">
            Four reasons people switch — and the four things every SDK on this
            site gets to observe.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <ScrollReveal key={feature.title}>
              <div className="h-full rounded-xl border border-ink-200 bg-accent-100 p-6 transition-shadow duration-200 ease-out-strong hover:shadow-lg hover:shadow-navy/5">
                <span className="text-3xl" aria-hidden>
                  {feature.emoji}
                </span>
                <h3 className="mt-4 font-headline text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {feature.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-ink-100">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-semibold">Featured</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <ScrollReveal key={product.id}>
                <TrackedLink
                  href={`/products/${product.id}`}
                  event="product_clicked"
                  eventProps={{ product_id: product.id, source: "home" }}
                  className="block overflow-hidden rounded-xl border border-ink-200 bg-white transition-shadow duration-200 ease-out-strong hover:shadow-lg hover:shadow-navy/5"
                >
                  <ProductTile product={product} className="h-40 w-full" />
                  <div className="flex items-baseline justify-between p-4">
                    <span className="font-headline font-semibold text-navy">
                      {product.name}
                    </span>
                    <span className="font-headline text-sm font-semibold text-accent-deep">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </TrackedLink>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <ScrollReveal>
          <h2 className="text-3xl font-semibold">
            Ready to light up your home?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-500">
            Free shipping, thirty-day returns, and a fake checkout your session
            replay tools will love.
          </p>
          <TrackedLink
            href="/products"
            event="cta_click"
            eventProps={{ cta: "footer_shop" }}
            className="mt-8 inline-block rounded-lg bg-accent px-8 py-3 font-headline text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out-strong hover:bg-accent-deep active:scale-[0.97]"
          >
            Browse products
          </TrackedLink>
        </ScrollReveal>
      </section>
    </>
  );
}
