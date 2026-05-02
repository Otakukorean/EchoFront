import api from "@/lib/api/client";

import type { CreateStorePayload, Store, StoreResponse, UpdateStorePayload } from "../types";

export class StoresService {
  /**
   * POST /stores
   * Creates a new store via multipart/form-data.
   */
  static async create(payload: CreateStorePayload): Promise<Store> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("slug", payload.slug);

    if (payload.description) {
      formData.append("description", payload.description);
    }

    formData.append("Logo", payload.Logo);

    if (payload.Cover) {
      formData.append("Cover", payload.Cover);
    }

    const { data } = await api.post<{ store: Store }>("/stores", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.store;
  }

  /**
   * GET /stores/me
   * Fetches the current user's store.
   */
  static async getMyStore(): Promise<StoreResponse> {
    const { data } = await api.get<StoreResponse>("/stores/me");
    return data;
  }

  /**
   * PUT /stores
   * Updates the current user's store via multipart/form-data.
   */
  static async update(payload: UpdateStorePayload): Promise<Store> {
    const formData = new FormData();
    
    if (payload.name) formData.append("name", payload.name);
    if (payload.slug) formData.append("slug", payload.slug);
    if (payload.description) formData.append("description", payload.description);
    if (payload.Logo) formData.append("Logo", payload.Logo);
    if (payload.Cover) formData.append("Cover", payload.Cover);

    const { data } = await api.put<{ store: Store }>("/stores", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.store;
  }
}
