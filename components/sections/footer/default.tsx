import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import EchoLogo from "../../logos/echo";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function FooterSection({
  logo = <EchoLogo />,
  name = "Echo",
  columns = [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "How it works", href: "#how-it-works" },
        { text: "Pricing", href: "#pricing" },
        { text: "Changelog", href: siteConfig.url },
      ],
    },
    {
      title: "Sellers",
      links: [
        { text: "Create a store", href: siteConfig.getStartedUrl },
        { text: "Sign in", href: `${siteConfig.getStartedUrl}?mode=login` },
        { text: "Documentation", href: siteConfig.url },
        { text: "Support", href: siteConfig.links.email },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: siteConfig.url },
        { text: "Blog", href: siteConfig.url },
        { text: "Twitter", href: siteConfig.links.twitter },
        { text: "GitHub", href: siteConfig.links.github },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Echo. All rights reserved.`,
  policies = [
    { text: "Privacy Policy", href: siteConfig.url },
    { text: "Terms of Service", href: siteConfig.url },
  ],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
              <p className="text-muted-foreground max-w-[200px] text-sm">
                Your store, live in seconds.
              </p>
            </FooterColumn>
            {columns.map((column) => (
              <FooterColumn key={column.title}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link) => (
                  <a
                    key={`${link.href}-${link.text}`}
                    href={link.href}
                    className="text-muted-foreground text-sm"
                  >
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy) => (
                <a key={`${policy.href}-${policy.text}`} href={policy.href}>
                  {policy.text}
                </a>
              ))}
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
