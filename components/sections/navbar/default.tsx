"use client";

import { type VariantProps } from "class-variance-authority";
import { LogOut, Menu } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useLogout } from "@/lib/features/auth/hooks";
import { useAuthStore } from "@/lib/features/auth/store";

import EchoLogo from "../../logos/echo";
import { Button, buttonVariants } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  className?: string;
}

const DEFAULT_NAV_LINKS: NavbarLink[] = [
  { text: "Features", href: "#features" },
  { text: "How it works", href: "#how-it-works" },
  { text: "Pricing", href: "#pricing" },
];

export default function Navbar({
  logo = <EchoLogo />,
  name = "Echo",
  homeUrl = "/",
  mobileLinks = DEFAULT_NAV_LINKS,
  className,
}: NavbarProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeId = useAuthStore((s) => s.user?.storeId);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const ctaHref = !isAuthenticated
    ? "/signup"
    : storeId
      ? "/dashboard"
      : "/create-store";

  const ctaLabel = isAuthenticated && storeId ? "Dashboard" : "Create Your Store";

  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {name}
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              {mobileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </NavbarLeft>

          <NavbarRight>
            {/* Sign in — hidden when authenticated */}
            {!isAuthenticated && (
              <a
                href="/login"
                className="hidden text-sm md:block"
              >
                Sign in
              </a>
            )}

            {/* CTA: context-aware based on auth + store state */}
            <Button variant="default" asChild>
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>

            {/* Logout — desktop, shown only when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                disabled={isLoggingOut}
                title="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="flex items-center gap-2">
                  <EchoLogo />
                  Echo
                </SheetTitle>
                <nav className="mt-8 flex flex-col gap-4">
                  {mobileLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.text}
                    </a>
                  ))}

                  {/* Mobile: Sign in — hidden when authenticated */}
                  {!isAuthenticated && (
                    <a
                      href="/login"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      Sign in
                    </a>
                  )}


                  <a
                    href={ctaHref}
                    className="bg-primary text-primary-foreground mt-2 rounded-md px-4 py-2 text-center text-sm font-medium"
                  >
                    {ctaLabel}
                  </a>

                  {/* Mobile: Logout — shown only when authenticated */}
                  {isAuthenticated && (
                    <button
                      onClick={() => logout()}
                      disabled={isLoggingOut}
                      className="text-destructive-foreground hover:text-destructive flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
