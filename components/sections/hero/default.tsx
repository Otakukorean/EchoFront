import { ArrowRightIcon, StoreIcon } from "lucide-react";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Badge } from "../../ui/badge";
import Glow from "../../ui/glow";
import { LinkButton, type LinkButtonProps } from "../../ui/link-button";
import { Mockup, MockupFrame } from "../../ui/mockup";
import Screenshot from "../../ui/screenshot";
import { Section } from "../../ui/section";

interface HeroButtonProps extends Omit<LinkButtonProps, "children"> {
  text: string;
}

interface HeroProps {
  badge?: ReactNode | false;
  title?: string;
  description?: string;
  mockup?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}

const DEFAULT_HERO_BUTTONS: HeroButtonProps[] = [
  {
    href: "/signup",
    text: "Create Your Store — It's Free",
    variant: "default",
    iconRight: <ArrowRightIcon className="size-4" />,
  },
  {
    href: "#how-it-works",
    text: "See how it works",
    variant: "glow",
  },
];

const DEFAULT_HERO_MOCKUP = (
  <Screenshot
    srcLight="/dashboard-light.png"
    srcDark="/dashboard-dark.png"
    alt="Echo store dashboard screenshot"
    width={1248}
    height={765}
    className="w-full"
  />
);

export default function Hero({
  badge = (
    <Badge variant="outline" className="gap-2">
      <StoreIcon className="size-3.5" />
      Multi-vendor e-commerce, reimagined
    </Badge>
  ),
  title = "Your store, live in seconds",
  description = "Echo lets anyone create a beautiful online store with a custom URL — no website needed. Add products, manage inventory, and start selling today.",
  mockup = DEFAULT_HERO_MOCKUP,
  buttons = DEFAULT_HERO_BUTTONS,
  className,
}: HeroProps) {
  return (
    <Section
      className={cn(
        "fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0",
        className,
      )}
    >
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && (
            <div className="animate-appear opacity-0">{badge}</div>
          )}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[620px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex flex-col items-center justify-center gap-3 opacity-0 delay-300 sm:flex-row sm:gap-4">
              {buttons.map((button) => (
                <LinkButton
                  key={`${button.href}-${button.text}`}
                  variant={button.variant || "default"}
                  size="lg"
                  href={button.href}
                  icon={button.icon}
                  iconRight={button.iconRight}
                >
                  {button.text}
                </LinkButton>
              ))}
            </div>
          )}
          {/* Slug preview pill */}
          <div className="animate-appear bg-muted/60 text-muted-foreground border-border relative z-10 flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm opacity-0 delay-500 backdrop-blur-sm">
            <span className="text-foreground/40">echo.com/</span>
            <span className="text-foreground font-medium">your-store-name</span>
          </div>
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <MockupFrame
                className="animate-appear opacity-0 delay-700"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-background/90 w-full rounded-xl border-0"
                >
                  {mockup}
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
