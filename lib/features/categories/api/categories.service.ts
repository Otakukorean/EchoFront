import api from "@/lib/api/client";

import type {
  Category,
  CreateCategoryPayload,
  GetCategoriesResponse,
  UpdateCategoryPayload,
} from "../types";

export class CategoriesService {
  /**
   * GET /categories
   * Fetches all categories for the current store.
   */
  static async getAll(): Promise<Category[]> {
    const { data } = await api.get<GetCategoriesResponse>("/categories");
    return data.categories;
  }

  /**
   * POST /categories
   * Creates a new category.
   */
  static async create(payload: CreateCategoryPayload): Promise<Category> {
    const { data } = await api.post<{ category: Category }>("/categories", {
      createCategoryDto: payload,
    });
    return data.category;
  }

  /**
   * DELETE /categories/:id
   * Deletes a category by ID.
   */
  static async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  /**
   * PUT /categories/:id
   * Updates an existing category.
   */
  static async update(
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> {
    const { data } = await api.put<{ category: Category }>(
      `/categories/${id}`,
      {
        updateCategoryDto: payload,
      }
    );
    return data.category;
  }
}
