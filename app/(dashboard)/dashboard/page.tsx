"use client";

import {
  ArrowUpRight,
  ExternalLink,
  Home,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/features/auth/store";
import { useMyStore } from "@/lib/features/stores/hooks";
import { Loader2 } from "lucide-react";

export default function DashboardHomePage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useMyStore();

  // Mock data for the dashboard
  const orders = {
    pending: 12,
    processing: 5,
    completed: 128,
  };

  const revenue = "$4,231.00";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Fallback to avoid errors if store is undefined (e.g. user hasn't created one yet)
  // In a real flow, a route guard would redirect them to /dashboard/create-store
  const storeName = data?.store.name || `${user?.displayName}'s Store`;
  const storeSlug = data?.store.slug || "my-awesome-store";

  return (
    <>

      {/* Header */}
      <header className="border-gray-200 bg-background/50 relative z-10 border-b backdrop-blur-md dark:border-gray-800">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {data?.store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data?.store.logoUrl}
                alt={storeName}
                className="size-10 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold leading-none">
                {storeName}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                echo.com/{storeSlug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href={`/${storeSlug}`} target="_blank">
                <ExternalLink className="mr-2 size-4" />
                View Store
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/settings">
                <Settings className="size-5 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Store Cover Image */}
      {data?.store.coverUrl && (
        <div className="relative w-full h-48 md:h-64 lg:h-80 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data?.store.coverUrl}
            alt="Store Cover"
            className="w-full h-full object-cover"
          />
          {/* Gradient fade into the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <main className="container relative z-10 mx-auto max-w-5xl p-4 pt-8 md:-mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Card */}
          <div className="bg-card border-gray-200 dark:border-gray-800 rounded-2xl border p-6 shadow-xl">
            <h2 className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {data?.orderStats?.totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'IQD' })}
              </span>
            </div>
          </div>

          {/* Orders Info */}
          <div className="bg-card border-gray-200 dark:border-gray-800 rounded-2xl border p-6 shadow-xl">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">
              Orders Overview
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-amber-500/10 p-4 flex-1">
                <span className="text-2xl font-bold text-amber-500">
                  {data?.orderStats?.ordersOverview.pending}
                </span>
                <span className="text-xs font-medium text-muted-foreground mt-1">
                  Pending
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-blue-500/10 p-4 flex-1">
                <span className="text-2xl font-bold text-blue-500">
                  {data?.orderStats?.ordersOverview.processing}
                </span>
                <span className="text-xs font-medium text-muted-foreground mt-1">
                  Processing
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-500/10 p-4 flex-1">
                <span className="text-2xl font-bold text-emerald-500">
                  {data?.orderStats?.ordersOverview.delivered}
                </span>
                <span className="text-xs font-medium text-muted-foreground mt-1">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions or Recent Activity could go here */}
        <div className="border-gray-200 dark:border-gray-800 mt-6 flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed bg-card/50 p-6 shadow-xl backdrop-blur-sm">
          <p className="text-muted-foreground text-sm">
            Recent activity will appear here.
          </p>
        </div>
      </main>
    </>
  );
}
