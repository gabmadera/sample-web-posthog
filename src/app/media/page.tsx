"use client";

import { Carousel } from "@/components/carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProductTile } from "@/components/product-card";
import { track } from "@/lib/analytics";
import { products } from "@/lib/catalog";

const scenes = [
  { id: "dawn", label: "Dawn", gradient: "from-accent-200 to-accent" },
  { id: "focus", label: "Focus", gradient: "from-accent to-accent-deep" },
  { id: "dusk", label: "Dusk", gradient: "from-accent-deep to-navy" },
  { id: "night", label: "Night", gradient: "from-navy to-ink-700" },
];

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Media</h1>
      <p className="mt-2 max-w-lg text-ink-500">
        Video playback, a snap carousel, lazy-loaded tiles, and a long scroll —
        the replay-fidelity gauntlet.
      </p>

      {/* Video — exercises play/pause capture and replay of media elements. */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Video</h2>
        <video
          controls
          preload="metadata"
          className="mt-4 aspect-video w-full rounded-xl bg-navy"
          onPlay={() => track("video_play", { video: "flower-demo" })}
          onPause={() => track("video_pause", { video: "flower-demo" })}
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        />
      </section>

      {/* Carousel */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">Scenes carousel</h2>
        <div className="mt-4">
          <Carousel
            label="scenes"
            slides={scenes.map((scene) => ({
              id: scene.id,
              node: (
                <div
                  className={`flex h-72 items-end rounded-xl bg-gradient-to-br p-6 ${scene.gradient}`}
                >
                  <span className="font-headline text-2xl font-bold text-white">
                    {scene.label}
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* Long lazy scroll — one reveal per row, fired once. */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">The long scroll</h2>
        <p className="mt-2 text-ink-500">
          Keep scrolling — good for scroll-depth metrics and replay seeking.
        </p>
        <div className="mt-8 space-y-24">
          {products.map((product, i) => (
            <ScrollReveal key={product.id}>
              <div
                className={`flex flex-col items-center gap-8 sm:flex-row ${
                  i % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                <ProductTile
                  product={product}
                  className="h-56 w-full rounded-2xl text-7xl sm:w-1/2"
                />
                <div className="sm:w-1/2">
                  <h3 className="font-headline text-2xl font-semibold">
                    {product.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-500">
                    {product.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
