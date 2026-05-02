"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { OrdersService } from "../api/orders.service";
import type { OrderStatus } from "../types";

export function useOrders(
  pageIndex: number = 0,
  pageSize: number = 10,
  status?: OrderStatus | "All"
) {
  return useQuery({
    queryKey: ["orders", pageIndex, pageSize, status],
    queryFn: () => OrdersService.getAll(pageIndex, pageSize, status),
    // Keep previous data while fetching next page to avoid flashing loading states
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      OrdersService.updateStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      // Invalidate the orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to update order status.");
    },
  });
}
