export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface PaginatedOrders {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  items: Order[];
}

export interface GetOrdersResponse {
  orders: PaginatedOrders;
}
