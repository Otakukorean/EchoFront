"use client";

import { Home, Package, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <nav className="border-gray-200 dark:border-gray-800 flex items-center gap-1 rounded-full border bg-background/80 p-1.5 shadow-2xl backdrop-blur-xl">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Home className="size-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          href="/dashboard/products"
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard/products"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Package className="size-4" />
          <span className="hidden sm:inline">Products</span>
        </Link>
        <Link
          href="/dashboard/orders"
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard/orders"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">Orders</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard/settings"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="size-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
