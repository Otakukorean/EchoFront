import api from "@/lib/api/client";

import type { GetOrdersResponse, OrderStatus, PaginatedOrders } from "../types";

export class OrdersService {
  /**
   * GET /orders
   * Fetches paginated orders.
   */
  static async getAll(
    pageIndex: number = 0,
    pageSize: number = 10,
    status?: OrderStatus | "All"
  ): Promise<PaginatedOrders> {
    const params: Record<string, any> = { pageIndex, pageSize };
    
    // Only add status if it's not "All" and exists
    if (status && status !== "All") {
      params.status = status;
    }

    const { data } = await api.get<GetOrdersResponse>("/orders", { params });
    return data.orders;
  }

  /**
   * PUT /orders/{id}/status
   * Updates the status of an order.
   */
  static async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<void> {
    await api.put(`/orders/${orderId}/status`, { status });
  }
}
