import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Products</h1>
      <p className="mt-2 max-w-lg text-ink-500">
        Eight ways to light a room. Every card click, quick view, and add to
        cart is a tracked event.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
