"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

import { makeQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use a ref so the client is created once per component mount (not per render)
  const clientRef = useRef<ReturnType<typeof makeQueryClient>>(null);
  if (!clientRef.current) {
    clientRef.current = makeQueryClient();
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
