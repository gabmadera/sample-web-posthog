"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal localStorage-backed external store. useSyncExternalStore renders the
 * server fallback during SSR/hydration, then swaps to the stored value — the
 * SSR-safe alternative to setState-in-effect hydration.
 */
export interface LocalStore<T> {
  get: () => T;
  getServer: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (cb: () => void) => () => void;
}

export function createLocalStore<T>(key: string, fallback: T): LocalStore<T> {
  let value = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      // corrupted storage — keep the fallback
    }
  };

  return {
    get: () => {
      load();
      return value;
    },
    getServer: () => fallback,
    set: (next) => {
      load();
      value = next instanceof Function ? next(value) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // storage full/blocked — state still works for the session
      }
      listeners.forEach((cb) => cb());
    },
    subscribe: (cb) => {
      load();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
