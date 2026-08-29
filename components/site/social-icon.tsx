import { GlobeIcon, MailIcon } from "lucide-react";

import {
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  StackOverflowIcon,
  XIcon,
} from "@/components/site/brand-icons";
import type { SocialIcon as SocialIconName } from "@/types/content";

// Only `className` is ever passed, so a narrow prop type keeps the hand-rolled
// brand SVGs and lucide's own components assignable to the same map.
const ICONS: Record<SocialIconName, React.ComponentType<{ className?: string }>> =
  {
    github: GithubIcon,
    linkedin: LinkedinIcon,
    facebook: FacebookIcon,
    stackoverflow: StackOverflowIcon,
    twitter: XIcon,
    mail: MailIcon,
    globe: GlobeIcon,
  };

export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName;
  className?: string;
}) {
  const Icon = ICONS[name] ?? ICONS.globe;
  return <Icon className={className} />;
}
