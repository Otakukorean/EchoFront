"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/lib/features/auth/store";

/**
 * Layout for (auth) routes like /login and /signup.
 * 
 * Protects these routes from being accessed by users who are already logged in.
 * If the user is authenticated, they are redirected to the home page.
 * While the initial auth state is loading, a spinner is shown to prevent a
 * flash of the login screen.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);


  return <>{children}</>;
}
