export interface StoreResponse {
  store: Store;
  orderStats: OrderStats;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorePayload {
  name: string;
  slug: string;
  description?: string;
  Logo: File;
  Cover?: File;
}

export interface UpdateStorePayload {
  name?: string;
  slug?: string;
  description?: string;
  Logo?: File;
  Cover?: File;
}

export interface OrderStats {
  totalRevenue:number;
  ordersOverview:OrdersOverview;
}

export interface OrdersOverview {
  pending:number;
  processing:number;
  delivered:number;
}
