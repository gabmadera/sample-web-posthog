"use client";

import Link from "next/link";
import { useRef } from "react";
import clsx from "clsx";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Button } from "@/components/button";
import { track } from "@/lib/analytics";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductTile({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center bg-gradient-to-br text-5xl",
        product.gradient,
        className,
      )}
      aria-hidden
    >
      {product.emoji}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openQuickView = () => {
    track("quick_view_opened", { product_id: product.id });
    dialogRef.current?.showModal();
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-ink-200 bg-white transition-shadow duration-200 ease-out-strong hover:shadow-lg hover:shadow-navy/5">
      <Link
        href={`/products/${product.id}`}
        onClick={() => track("product_clicked", { product_id: product.id })}
      >
        <ProductTile product={product} className="h-40 w-full" />
      </Link>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="font-headline font-semibold text-navy hover:text-accent-deep"
          >
            {product.name}
          </Link>
          <span className="font-headline text-sm font-semibold text-accent-deep">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">{product.tagline}</p>
        <div className="mt-4 flex gap-2">
          <AddToCartButton product={product} source="grid" className="flex-1" />
          <Button variant="secondary" onClick={openQuickView}>
            Quick view
          </Button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="modal m-auto w-full max-w-md rounded-2xl p-0 backdrop:bg-transparent"
        aria-label={`Quick view: ${product.name}`}
      >
        <ProductTile product={product} className="h-44 w-full" />
        <div className="p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <span className="font-headline font-semibold text-accent-deep">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-500">{product.description}</p>
          <div className="mt-5 flex gap-2">
            <AddToCartButton
              product={product}
              source="quick_view"
              className="flex-1"
            />
            <Button
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
