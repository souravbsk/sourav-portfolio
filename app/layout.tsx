import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProfile } from "@/lib/content";
import { reportMissingEnv } from "@/lib/env";

import "./globals.css";

reportMissingEnv();

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = profile.seoTitle || `${profile.name} — Full Stack Developer`;
  const description = profile.seoDescription || profile.shortBio;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://souravbasak.com",
    ),
    title: {
      default: title,
      template: `%s — ${profile.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: profile.name,
    },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/sourabsk.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#060b18" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // next-themes writes the class before paint; React would otherwise warn.
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background antialiased">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
