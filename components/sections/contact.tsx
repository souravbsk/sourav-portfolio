import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/sections/contact-form";
import { SocialIcon } from "@/components/site/social-icon";
import { SectionHeading } from "@/components/site/section-heading";
import { externalHref } from "@/lib/utils";
import type { ProfileData } from "@/types/content";

export function Contact({ profile }: { profile: ProfileData }) {
  const details = [
    profile.email && {
      icon: MailIcon,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && {
      icon: PhoneIcon,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
    },
    profile.location && {
      icon: MapPinIcon,
      label: "Location",
      value: profile.location,
      href: undefined,
    },
  ].filter(Boolean) as {
    icon: typeof MailIcon;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="05 — Contact"
          title="Let's talk"
          description="Tell me what you are building. I read every message and reply to the ones I can genuinely help with."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal direction="right" className="space-y-3">
            {details.map((detail) => {
              const content = (
                <div className="panel panel-glow flex items-center gap-4 p-4 transition-transform duration-300 hover:-translate-y-0.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-panel-strong text-cyan-brand">
                    <detail.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="truncate text-sm">{detail.value}</p>
                  </div>
                </div>
              );

              return detail.href ? (
                <Link
                  key={detail.label}
                  href={detail.href}
                  className="block rounded-xl"
                >
                  {content}
                </Link>
              ) : (
                <div key={detail.label}>{content}</div>
              );
            })}

            {profile.socials.length > 0 && (
              <div className="panel p-4">
                <p className="eyebrow mb-3">Elsewhere</p>
                <ul className="flex flex-wrap gap-2">
                  {profile.socials.map((social) => (
                    <li key={social.label}>
                      <Link
                        href={externalHref(social.url) ?? "#"}
                        target={social.icon === "mail" ? undefined : "_blank"}
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:border-cyan-brand/50 hover:text-cyan-brand"
                      >
                        <SocialIcon name={social.icon} className="size-3.5" />
                        {social.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          <Reveal direction="left" delay={0.08}>
            <div className="panel relative p-6 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
