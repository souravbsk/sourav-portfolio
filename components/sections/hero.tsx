import Link from "next/link";
import { ArrowRightIcon, DownloadIcon, FileTextIcon } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Typewriter } from "@/components/motion/typewriter";
import { SocialIcon } from "@/components/site/social-icon";
import { HeroVisual } from "@/components/three/hero-visual";
import { Button } from "@/components/ui/button";
import { externalHref } from "@/lib/utils";
import type { ProfileData } from "@/types/content";

export function Hero({ profile }: { profile: ProfileData }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12">
      {/* Two quiet background layers only: a blueprint grid fading out, and a
          single violet bloom behind the 3D object. */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="order-2 lg:order-1">
            <Reveal direction="right" className="flex items-center gap-3">
              {profile.availability && (
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-brand/30 bg-cyan-brand/8 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-cyan-brand">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-brand opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-cyan-brand" />
                  </span>
                  {profile.availability}
                </span>
              )}
            </Reveal>

            <Reveal direction="right" delay={0.06} className="mt-5">
              <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {profile.name}
              </h1>
            </Reveal>

            <Reveal direction="right" delay={0.12} className="mt-3">
              <p className="font-mono text-lg text-violet-brand sm:text-xl">
                <Typewriter words={profile.roles} />
              </p>
            </Reveal>

            <Reveal direction="right" delay={0.18} className="mt-6">
              <p className="balance max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.headline}
              </p>
            </Reveal>

            <Reveal direction="right" delay={0.24} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="gradient" size="lg">
                  <Link href="/resume">
                    <FileTextIcon />
                    View resume
                  </Link>
                </Button>

                {profile.resumeFileUrl && (
                  <Button asChild variant="outline" size="lg">
                    <a href={profile.resumeFileUrl} download>
                      <DownloadIcon />
                      Download
                    </a>
                  </Button>
                )}

                <Button asChild variant="ghost" size="lg">
                  <Link href="#contact">
                    Get in touch
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <RevealGroup delay={0.3} className="mt-9 flex items-center gap-2" as="ul">
              {profile.socials.map((social) => (
                <RevealItem key={social.label} as="li">
                  <Link
                    href={externalHref(social.url) ?? "#"}
                    target={social.icon === "mail" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-1 hover:border-cyan-brand/50 hover:text-cyan-brand"
                  >
                    <SocialIcon name={social.icon} className="size-4" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        {profile.stats.length > 0 && (
          <RevealGroup
            delay={0.15}
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
          >
            {profile.stats.map((stat) => (
              <RevealItem
                key={stat.label}
                className="bg-background px-5 py-6 transition-colors hover:bg-panel"
              >
                <p className="font-display text-3xl font-semibold text-gradient">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
