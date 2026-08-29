import {
  ArrowUpRightIcon,
  DownloadIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { externalHref } from "@/lib/utils";
import type { ProfileData } from "@/types/content";

export function ResumeContactRail({ profile }: { profile: ProfileData }) {
  const phoneHref = profile.phone
    ? `tel:${profile.phone.replace(/[^\d+]/g, "")}`
    : undefined;

  return (
    <aside className="print-hidden lg:sticky lg:top-24 lg:self-start">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-brand/25 bg-panel p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[radial-gradient(circle,var(--glow-cyan),transparent_70%)]"
        />

        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-cyan-brand">
          Reach me
        </p>
        <p className="mt-2 font-display text-xl font-semibold leading-tight">
          {profile.name}
        </p>
        {profile.roles[0] && (
          <p className="mt-1 text-sm text-muted-foreground">{profile.roles[0]}</p>
        )}

        <ul className="mt-5 space-y-2">
          {profile.phone && (
            <ContactChip
              href={phoneHref}
              icon={PhoneIcon}
              label="Phone"
              value={profile.phone}
            />
          )}
          {profile.email && (
            <ContactChip
              href={`mailto:${profile.email}`}
              icon={MailIcon}
              label="Email"
              value={profile.email}
            />
          )}
          {profile.location && (
            <ContactChip icon={MapPinIcon} label="Based in" value={profile.location} />
          )}
        </ul>

        {profile.socials.filter((social) => social.icon !== "mail").length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.socials
              .filter((social) => social.icon !== "mail")
              .map((social) => (
                <a
                  key={social.label}
                  href={externalHref(social.url)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-cyan-brand/40 hover:text-cyan-brand"
                >
                  {social.label}
                  <ArrowUpRightIcon className="size-3" />
                </a>
              ))}
          </div>
        )}

        {profile.resumeFileUrl && (
          <Button asChild variant="gradient" className="mt-5 w-full">
            <a href={profile.resumeFileUrl} download>
              <DownloadIcon />
              Download PDF
            </a>
          </Button>
        )}
      </div>
    </aside>
  );
}

function ContactChip({
  href,
  icon: Icon,
  label,
  value,
}: {
  href?: string;
  icon: typeof MailIcon;
  label: string;
  value: string;
}) {
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cyan-brand/10 text-cyan-brand">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm">{value}</span>
      </span>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 px-3 py-2.5 transition-colors hover:border-cyan-brand/35";

  return href ? (
    <li>
      <a href={href} className={className}>
        {inner}
      </a>
    </li>
  ) : (
    <li className={className}>{inner}</li>
  );
}
