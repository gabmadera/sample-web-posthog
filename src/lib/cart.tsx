"use client";

import { useMemo } from "react";
import { getProduct } from "@/lib/catalog";
import { createLocalStore, useLocalStore } from "@/lib/local-store";

export interface CartItem {
  productId: string;
  qty: number;
}

const cartStore = createLocalStore<CartItem[]>("showcase-cart", []);

export function addToCart(productId: string, qty = 1) {
  cartStore.set((prev) => {
    const existing = prev.find((i) => i.productId === productId);
    if (existing) {
      return prev.map((i) =>
        i.productId === productId ? { ...i, qty: i.qty + qty } : i,
      );
    }
    return [...prev, { productId, qty }];
  });
}

export function removeFromCart(productId: string) {
  cartStore.set((prev) => prev.filter((i) => i.productId !== productId));
}

export function setCartQty(productId: string, qty: number) {
  cartStore.set((prev) =>
    qty <= 0
      ? prev.filter((i) => i.productId !== productId)
      : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
  );
}

export function clearCart() {
  cartStore.set([]);
}

export function useCart() {
  const items = useLocalStore(cartStore);

  const { count, total } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const item of items) {
      const product = getProduct(item.productId);
      if (!product) continue;
      count += item.qty;
      total += product.price * item.qty;
    }
    return { count, total };
  }, [items]);

  return {
    items,
    count,
    total,
    add: addToCart,
    remove: removeFromCart,
    setQty: setCartQty,
    clear: clearCart,
  };
}
