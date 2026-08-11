"use client";

import { toast } from "sonner";
import { Button } from "@/components/button";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { formatPrice, type Product } from "@/lib/catalog";

export function AddToCartButton({
  product,
  qty = 1,
  source,
  className,
}: {
  product: Product;
  qty?: number;
  source: "grid" | "quick_view" | "detail";
  className?: string;
}) {
  const { add } = useCart();

  return (
    <Button
      className={className}
      onClick={() => {
        add(product.id, qty);
        track("add_to_cart", {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          qty,
          source,
        });
        toast.success(`${product.name} added to cart`, {
          description: formatPrice(product.price * qty),
        });
      }}
    >
      Add to cart
    </Button>
  );
}
