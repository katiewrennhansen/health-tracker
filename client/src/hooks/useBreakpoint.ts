import { useSyncExternalStore } from "react";

export type Breakpoint = "sm" | "md" | "lg";

/** Media query for "at least this breakpoint", using the value from `--breakpoint-*` in index.css. */
function minWidthQuery(breakpoint: Breakpoint) {
  const width = getComputedStyle(document.documentElement)
    .getPropertyValue(`--breakpoint-${breakpoint}`)
    .trim();
  return window.matchMedia(`(min-width: ${width})`);
}

/**
 * Whether the screen is at least `breakpoint` wide: the same test as Tailwind's `md:` prefix, so
 * `useBreakpoint("md")` is true exactly when `md:` classes apply. Updates when the window is resized
 * across the breakpoint.
 */
export function useBreakpoint(breakpoint: Breakpoint) {
  return useSyncExternalStore(
    (onChange) => {
      const query = minWidthQuery(breakpoint);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => minWidthQuery(breakpoint).matches,
  );
}
