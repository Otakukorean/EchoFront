import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // 1 minute — won't refetch if data is fresh
        refetchOnWindowFocus: false, // don't refetch when user switches tabs
        refetchOnMount: false,       // don't refetch on every component mount
        refetchOnReconnect: false,   // don't refetch on network reconnect
        retry: false,                // don't retry failed requests automatically
      },
    },
  });
}
