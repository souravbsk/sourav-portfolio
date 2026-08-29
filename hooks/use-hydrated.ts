"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` while rendering on the server and during hydration, `true` after.
 *
 * Useful for output that can only be correct on the client, such as the theme
 * toggle icon. Built on `useSyncExternalStore` instead of the usual
 * `useState(false)` plus `useEffect(() => setMounted(true))`, which triggers an
 * extra cascading render.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
