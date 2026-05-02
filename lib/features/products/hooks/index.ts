"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProductsService } from "../api/products.service";
import type { CreateProductPayload, UpdateProductPayload } from "../types";
import { toast } from "sonner";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      ProductsService.create(payload),
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error("Failed to create product");
    },
  });
}

export function useProductsInfinite(pageSize: number = 10, search?: string) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", pageSize, search],
    queryFn: ({ pageParam = 0 }) => ProductsService.getAll(pageParam, pageSize, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // If we've received less items than the page size, we're at the end
      if (lastPage.items.length < lastPage.pageSize) {
        return undefined;
      }
      // Otherwise fetch the next page
      return lastPage.pageIndex + 1;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => ProductsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateVariation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      ProductsService.createVariation(productId, formData),
    onSuccess: () => {
      toast.success("Variation added successfully!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
}

export function useDeleteVariation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variationId: string) =>
      ProductsService.deleteVariation(productId, variationId),
    onSuccess: () => {
      toast.success("Variation deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
}

export function useUpdateVariation(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variationId, formData }: { variationId: string; formData: FormData }) =>
      ProductsService.updateVariation(productId, variationId, formData),
    onSuccess: () => {
      toast.success("Variation updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
}

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      ProductsService.update(productId, payload),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "infinite"] });
    },
  });
}

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      ProductsService.deleteImage(productId, imageId),
    onSuccess: () => {
      toast.success("Image deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });
}

export function useSetPrimaryProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      ProductsService.setPrimaryImage(productId, imageId),
    onSuccess: () => {
      toast.success("Primary image updated!");
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
      queryClient.invalidateQueries({ queryKey: ["products", "infinite"] });
    },
  });
}
