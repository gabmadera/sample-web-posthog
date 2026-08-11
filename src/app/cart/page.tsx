"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ProductTile } from "@/components/product-card";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import { formatPrice, getProduct } from "@/lib/catalog";

export default function CartPage() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl" aria-hidden>
          🛒
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-ink-500">
          Add a lamp or two — the funnel events are waiting.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-headline text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out-strong hover:bg-accent-deep active:scale-[0.97]"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Cart</h1>
      <ul className="mt-8 divide-y divide-ink-200 rounded-xl border border-ink-200">
        {items.map((item) => {
          const product = getProduct(item.productId);
          if (!product) return null;
          return (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <ProductTile
                product={product}
                className="h-16 w-16 shrink-0 rounded-lg text-3xl"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="font-headline font-semibold text-navy hover:text-accent-deep"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-ink-500">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  aria-label={`Decrease ${product.name} quantity`}
                  className="!px-3"
                  onClick={() => setQty(item.productId, item.qty - 1)}
                >
                  −
                </Button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <Button
                  variant="secondary"
                  aria-label={`Increase ${product.name} quantity`}
                  className="!px-3"
                  onClick={() => setQty(item.productId, item.qty + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  remove(item.productId);
                  track("cart_item_removed", { product_id: item.productId });
                }}
              >
                Remove
              </Button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={clear}>
          Clear cart
        </Button>
        <div className="text-right">
          <p className="text-sm text-ink-500">{count} items</p>
          <p className="font-headline text-2xl font-bold text-navy">
            {formatPrice(total)}
          </p>
        </div>
      </div>
      <Button
        className="mt-6 w-full py-3.5"
        onClick={() => {
          track("checkout_started", { items: count, total });
          router.push("/checkout");
        }}
      >
        Proceed to checkout
      </Button>
    </div>
  );
}
