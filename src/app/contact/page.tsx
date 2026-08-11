"use client";

import { useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { track } from "@/lib/analytics";

const topics = ["Support", "Sales", "Press", "Other"];

export default function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nextErrors: Record<string, string> = {};

    const email = String(data.get("email") ?? "").trim();
    if (!String(data.get("name") ?? "").trim()) nextErrors.name = "Required";
    if (!email) nextErrors.email = "Required";
    else if (!email.includes("@")) nextErrors.email = "Invalid email";
    if (String(data.get("message") ?? "").trim().length < 10)
      nextErrors.message = "Tell us a bit more (min. 10 characters)";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      track("form_error", {
        form: "contact",
        fields: Object.keys(nextErrors).join(","),
      });
      return;
    }

    track("contact_submitted", { topic: String(data.get("topic")) });
    toast.success("Message sent — we'll get back to you soon.");
    form.reset();
    setSent(true);
  };

  const inputClasses = (error?: string) =>
    clsx(
      "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy outline-none",
      "transition-[border-color,box-shadow] duration-150",
      "focus:border-accent focus:ring-2 focus:ring-accent-200",
      error ? "border-red-700" : "border-ink-300",
    );

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="mt-2 text-ink-500">
        Validated form — failed submits fire <code>form_error</code> with field
        names (never values), successes fire <code>contact_submitted</code>.
      </p>

      {sent && (
        <div className="mt-6 rounded-lg border border-green-800/20 bg-green-800/5 px-4 py-3 text-sm text-green-800">
          Thanks! Your (pretend) message was recorded.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Name
          </span>
          <input name="name" className={inputClasses(errors.name)} />
          {errors.name && (
            <span className="mt-1 block text-xs text-red-800">
              {errors.name}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            data-uxc="obfuscated"
            className={clsx("pii-field", inputClasses(errors.email))}
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-red-800">
              {errors.email}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Topic
          </span>
          <select name="topic" className={inputClasses()}>
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Message
          </span>
          <textarea
            name="message"
            rows={5}
            className={inputClasses(errors.message)}
          />
          {errors.message && (
            <span className="mt-1 block text-xs text-red-800">
              {errors.message}
            </span>
          )}
        </label>
        <Button type="submit" className="w-full py-3">
          Send message
        </Button>
      </form>
    </div>
  );
}
