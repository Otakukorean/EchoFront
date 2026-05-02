import api from "@/lib/api/client";

import type {
  CreateProductPayload,
  GetProductResponse,
  GetProductsResponse,
  PaginatedProducts,
  Product,
  ProductVariation,
  UpdateProductPayload,
} from "../types";

export class ProductsService {
  /**
   * GET /products
   * Fetches paginated products.
   */
  static async getAll(
    pageIndex: number = 0,
    pageSize: number = 10,
    search?: string
  ): Promise<PaginatedProducts> {
    const { data } = await api.get<GetProductsResponse>("/products", {
      params: { pageIndex, pageSize, ...(search ? { search } : {}) },
    });
    return data.products;
  }

  /**
   * GET /products/:id
   * Fetches a single product by ID.
   */
  static async getById(id: string): Promise<Product> {
    const { data } = await api.get<GetProductResponse>(`/products/${id}`);
    return data.product;
  }

  /**
   * POST /products
   * Creates a new product.
   */
  static async create(payload: CreateProductPayload): Promise<Product> {
    const { data } = await api.post<{ product: Product }>("/products", {
      createProductDto: payload,
    });
    return data.product;
  }

  /**
   * PUT /products/{id}
   * Updates an existing product.
   */
  static async update(
    id: string,
    payload: UpdateProductPayload
  ): Promise<Product> {
    const { data } = await api.put<{ product: Product }>(`/products/${id}`, {
      updateProductDto: payload,
    });
    return data.product;
  }

  /**
   * POST /product/{id}/images
   * Uploads an image for a product.
   * Expects a FormData containing: file, isPrimary, index.
   */
  static async uploadImage(
    productId: string,
    formData: FormData
  ): Promise<void> {
    await api.post(`/products/${productId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * DELETE /products/{productId}/images/{imageId}
   * Deletes a product image.
   */
  static async deleteImage(
    productId: string,
    imageId: string
  ): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  }

  /**
   * PUT /products/{productId}/images/{imageId}/primary
   * Sets an image as the primary image for a product.
   */
  static async setPrimaryImage(
    productId: string,
    imageId: string
  ): Promise<void> {
    await api.put(`/products/${productId}/images/${imageId}/primary`);
  }

  /**
   * POST /products/{id}/variations
   * Creates a new variation for a product.
   */
  static async createVariation(
    productId: string,
    formData: FormData
  ): Promise<ProductVariation> {
    const { data } = await api.post<{ variation: ProductVariation }>(
      `/products/${productId}/variations`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.variation;
  }

  /**
   * DELETE /products/{productId}/variations/{variationId}
   * Deletes a variation for a product.
   */
  static async deleteVariation(
    productId: string,
    variationId: string
  ): Promise<void> {
    await api.delete(`/products/${productId}/variations/${variationId}`);
  }

  /**
   * PUT /products/{productId}/variations/{variationId}
   * Updates an existing variation.
   */
  static async updateVariation(
    productId: string,
    variationId: string,
    formData: FormData
  ): Promise<ProductVariation> {
    const { data } = await api.put<{ variation: ProductVariation }>(
      `/products/${productId}/variations/${variationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.variation;
  }
}
