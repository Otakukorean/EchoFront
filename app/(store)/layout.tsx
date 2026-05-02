"use client"

import { useAuthStore } from "@/lib/features/auth/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading  , user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
    if(isAuthenticated && user?.storeId){
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show a loading spinner while we're waiting for the initial auth check
  // or if the user is authenticated and we're waiting for the redirect to happen.
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      {/* Subtle background glow shared across all dashboard pages */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="bg-brand/10 absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />
      </div>

      {/* Main page content (rendered on top of glow) */}
      <div className="relative z-10 pb-32">
        {children}
      </div>
    </div>
  );
}
