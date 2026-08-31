import Image from "next/image";
import { MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import type { ProfileData } from "@/types/content";

export function About({ profile }: { profile: ProfileData }) {
  const contactRows = [
    profile.email && { icon: MailIcon, label: "Email", value: profile.email },
    profile.phone && { icon: PhoneIcon, label: "Phone", value: profile.phone },
    profile.location && {
      icon: MapPinIcon,
      label: "Based in",
      value: profile.location,
    },
  ].filter(Boolean) as {
    icon: typeof MailIcon;
    label: string;
    value: string;
  }[];

  return (
    <section id="about" className="scroll-mt-24 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="01 — About" title="A little context" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <Reveal direction="right">
            <div className="panel panel-glow relative overflow-hidden p-2">
              <div className="relative aspect-5/5 overflow-hidden rounded-xl bg-panel-strong">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 1024px) 80vw, 420px"
                    className="object-cover object-[center_18%]"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-6xl text-muted-foreground/40">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/90 to-transparent"
                />
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal direction="left">
              <p className="max-w-2xl text-base leading-[1.8] text-muted-foreground md:text-lg">
                {profile.bio}
              </p>
            </Reveal>

            {contactRows.length > 0 && (
              <Reveal direction="left" delay={0.1}>
                <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                  {contactRows.map((row) => (
                    <div key={row.label} className="bg-background p-4">
                      <dt className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                        <row.icon className="size-3.5" />
                        {row.label}
                      </dt>
                      <dd className="mt-2 truncate text-sm" title={row.value}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
