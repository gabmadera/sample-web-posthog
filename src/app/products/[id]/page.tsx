import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductTile } from "@/components/product-card";
import { Tabs } from "@/components/tabs";
import { TrackView } from "@/components/track-view";
import { formatPrice, getProduct, products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const product = getProduct((await params).id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = getProduct((await params).id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <TrackView
        event="product_viewed"
        eventProps={{ product_id: product.id, price: product.price }}
      />
      <Link
        href="/products"
        className="text-sm text-accent-deep hover:text-accent"
      >
        ← All products
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductTile
          product={product}
          className="h-80 rounded-2xl text-8xl lg:h-full"
        />
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-lg text-ink-500">{product.tagline}</p>
          <p className="mt-4 font-headline text-2xl font-bold text-accent-deep">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton
            product={product}
            source="detail"
            className="mt-6 w-full sm:w-auto sm:px-10"
          />
          <div className="mt-10">
            <Tabs
              tabs={[
                {
                  label: "Overview",
                  content: (
                    <p className="leading-relaxed text-ink-700">
                      {product.description}
                    </p>
                  ),
                },
                {
                  label: "Specs",
                  content: (
                    <dl className="divide-y divide-ink-200 rounded-xl border border-ink-200">
                      {product.specs.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between px-4 py-3 text-sm"
                        >
                          <dt className="text-ink-500">{label}</dt>
                          <dd className="font-medium text-navy">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                {
                  label: "Shipping",
                  content: (
                    <p className="leading-relaxed text-ink-700">
                      Free carbon-neutral shipping in 3–5 business days.
                      Thirty-day returns, no questions asked. This is a demo
                      store — nothing actually ships.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
