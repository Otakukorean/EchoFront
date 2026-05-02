"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/features/auth/store";

import { StoresService } from "../api/stores.service";
import type { CreateStorePayload, UpdateStorePayload } from "../types";

export function useCreateStore() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: CreateStorePayload) => StoresService.create(payload),
    onSuccess: (store) => {
      toast.success("Store created successfully!");
      
      // Update the current user in memory so the navbar and app know they have a store
      if (user) {
        setUser({ ...user, storeId: store.id });
      }

      // Invalidate the auth/me cache so the next background fetch has the updated user
      queryClient.invalidateQueries({ queryKey: ["auth", "bootstrap"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      // Redirect to the newly created store dashboard
      router.push("/dashboard");
    },
  });
}

export function useMyStore() {
  return useQuery({
    queryKey: ["stores", "me"],
    queryFn: StoresService.getMyStore,
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStorePayload) => StoresService.update(payload),
    onSuccess: () => {
      toast.success("Store updated successfully!");
      // Invalidate the store queries so it fetches the fresh data
      queryClient.invalidateQueries({ queryKey: ["stores", "me"] });
    },
  });
}
