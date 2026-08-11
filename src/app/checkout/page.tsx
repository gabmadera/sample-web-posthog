"use client";

import Link from "next/link";
import { useState, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

function Field({
  label,
  error,
  pii,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** Marks inputs that occlusion rules must hide in session replay. */
  pii?: boolean;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </span>
      <input
        {...props}
        data-uxc={pii ? "obfuscated" : undefined}
        className={clsx(
          "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy outline-none",
          "transition-[border-color,box-shadow] duration-150",
          "focus:border-accent focus:ring-2 focus:ring-accent-200",
          error ? "border-red-700" : "border-ink-300",
          pii && "pii-field",
        )}
      />
      {error && <span className="mt-1 block text-xs text-red-800">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const { items, count, total, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const required = [
      "name",
      "email",
      "address",
      "card_number",
      "card_expiry",
      "card_cvc",
    ];
    const nextErrors: Record<string, string> = {};
    for (const field of required) {
      if (!String(data.get(field) ?? "").trim()) {
        nextErrors[field] = "Required";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Field names only — never values — leave the browser.
      track("form_error", {
        form: "checkout",
        fields: Object.keys(nextErrors).join(","),
      });
      return;
    }
    track("checkout_completed", { items: count, total });
    toast.success("Order placed", { description: formatPrice(total) });
    clear();
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        {/* Rare, first-time moment — the delight budget lives here. */}
        <p className="rise-in text-6xl" aria-hidden>
          ✅
        </p>
        <h1
          className="rise-in mt-6 text-3xl font-semibold"
          style={{ "--rise-index": 1 } as React.CSSProperties}
        >
          Order placed!
        </h1>
        <p
          className="rise-in mt-3 text-ink-500"
          style={{ "--rise-index": 2 } as React.CSSProperties}
        >
          Nothing will arrive — but the <code>checkout_completed</code> event
          just fired to every registered SDK.
        </p>
        <Link
          href="/products"
          className="rise-in mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-headline text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out-strong hover:bg-accent-deep active:scale-[0.97]"
          style={{ "--rise-index": 3 } as React.CSSProperties}
        >
          Keep shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-ink-500">Your cart is empty.</p>
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
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-ink-500">
        {count} items · {formatPrice(total)} — card fields below are the
        occlusion targets (<code>.pii-field</code>).
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
        <fieldset className="space-y-4">
          <legend className="font-headline font-semibold text-navy">
            Contact
          </legend>
          <Field label="Full name" name="name" error={errors.name} />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            error={errors.email}
            pii
          />
          <Field
            label="Shipping address"
            name="address"
            error={errors.address}
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-headline font-semibold text-navy">
            Payment
          </legend>
          <Field
            label="Card number"
            name="card_number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            autoComplete="off"
            error={errors.card_number}
            pii
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Expiry"
              name="card_expiry"
              placeholder="MM/YY"
              autoComplete="off"
              error={errors.card_expiry}
              pii
            />
            <Field
              label="CVC"
              name="card_cvc"
              inputMode="numeric"
              placeholder="123"
              autoComplete="off"
              error={errors.card_cvc}
              pii
            />
          </div>
        </fieldset>

        <Button type="submit" className="w-full py-3.5">
          Place order · {formatPrice(total)}
        </Button>
      </form>
    </div>
  );
}
