"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      // Without this, every colour on the page cross-fades when the theme
      // flips, which looks like a bug rather than a transition.
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
