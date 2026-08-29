import Link from "next/link";

import { SocialIcon } from "@/components/site/social-icon";
import { externalHref } from "@/lib/utils";
import type { ProfileData } from "@/types/content";

export function SiteFooter({ profile }: { profile: ProfileData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            © {year} {profile.name}
          </p>
         
        </div>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-2">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <Link
                  href={externalHref(social.url) ?? "#"}
                  target={social.icon === "mail" ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-cyan-brand/50 hover:text-cyan-brand"
                >
                  <SocialIcon name={social.icon} className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
