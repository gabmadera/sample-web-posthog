"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { identify, reset, track } from "@/lib/analytics";
import { createLocalStore, useLocalStore } from "@/lib/local-store";

interface User {
  email: string;
  name: string;
  plan: string;
}

const userStore = createLocalStore<User | null>("showcase-user", null);

export default function AccountPage() {
  const user = useLocalStore(userStore);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    if (!email || !email.includes("@") || !name) {
      setError("Enter a name and a valid email — any password works.");
      track("form_error", { form: "login", fields: "name,email" });
      return;
    }
    const newUser: User = { email, name, plan: "Home Pro" };
    userStore.set(newUser);
    setError("");
    // The identify() every SDK maps to its own user model.
    identify(email, { name, plan: newUser.plan });
    track("login", { method: "password" });
    toast.success(`Welcome back, ${name}`);
  };

  const handleLogout = () => {
    userStore.set(null);
    track("logout");
    // reset() should detach the identity in every SDK — verify in each tool.
    reset();
    toast("Signed out");
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-ink-200 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-headline text-xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{user.name}</h1>
          {/* Emails are PII — same occlusion class as the checkout card fields. */}
          <p className="pii-field mt-1 text-ink-500">{user.email}</p>
          <dl className="mt-6 space-y-3 border-t border-ink-200 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Plan</dt>
              <dd className="font-medium text-navy">{user.plan}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Identity status</dt>
              <dd className="font-medium text-green-800">
                identify() sent
              </dd>
            </div>
          </dl>
          <Button variant="secondary" className="mt-8 w-full" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      <p className="mt-2 text-ink-500">
        Fake login — submitting calls <code>identify()</code> on every
        registered SDK.
      </p>
      <form onSubmit={handleLogin} noValidate className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Name
          </span>
          <input
            name="name"
            className="w-full rounded-lg border border-ink-300 px-3.5 py-2.5 text-sm text-navy outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent-200"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="pii-field w-full rounded-lg border border-ink-300 px-3.5 py-2.5 text-sm text-navy outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent-200"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="pii-field w-full rounded-lg border border-ink-300 px-3.5 py-2.5 text-sm text-navy outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent-200"
          />
        </label>
        {error && <p className="text-sm text-red-800">{error}</p>}
        <Button type="submit" className="w-full py-3">
          Sign in
        </Button>
      </form>
    </div>
  );
}
