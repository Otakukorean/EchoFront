"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MultiCategorySelect } from "@/components/sections/dashboard/multi-category-select";
import { ProductImageUploader } from "@/components/sections/dashboard/product-image-uploader";
import { ProductsService } from "@/lib/features/products/api/products.service";
import {
  useProduct,
  useUpdateProduct,
  useDeleteProductImage,
  useSetPrimaryProductImage,
} from "@/lib/features/products/hooks";
import { createProductSchema, type CreateProductFormValues } from "@/lib/features/products/validations";
import { Badge } from "@/components/ui/badge";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { mutateAsync: updateProductAsync, isPending: isUpdatingProduct } = useUpdateProduct(productId);
  const { mutateAsync: deleteImageAsync, isPending: isDeletingImage } = useDeleteProductImage(productId);
  const { mutateAsync: setPrimaryImageAsync, isPending: isSettingPrimary } = useSetPrimaryProductImage(productId);

  const [images, setImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const isPending = isUpdatingProduct || isUploadingImages || isDeletingImage || isSettingPrimary;

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "IQD",
      sku: "",
      isActive: true,
      categoryIds: [],
    },
  });

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        currency: product.currency,
        sku: product.sku || "",
        isActive: product.isActive,
        categoryIds: product.categories?.map((c) => c.id) || [],
      });
    }
  }, [product, form]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImageAsync(imageId);
    } catch (e) {
      toast.error("Failed to delete image.");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await setPrimaryImageAsync(imageId);
    } catch (e) {
      toast.error("Failed to set primary image.");
    }
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    try {
      // 1. Update product details
      await updateProductAsync(values);

      // 2. Upload any new images
      if (images.length > 0) {
        setIsUploadingImages(true);
        try {
          // If there are no existing images, the first new uploaded image becomes primary
          const hasExistingImages = product?.images && product.images.length > 0;
          
          await Promise.all(
            images.map((file, index) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("isPrimary", (!hasExistingImages && index === 0) ? "true" : "false");
              
              // We don't strictly need to manage index explicitly when adding onto existing
              formData.append("index", "0");

              return ProductsService.uploadImage(productId, formData);
            })
          );
        } catch (imageError) {
          toast.error("Product updated, but some new images failed to upload.");
          router.push(`/dashboard/products/${productId}`);
          return;
        } finally {
          setIsUploadingImages(false);
        }
      }

      toast.success("Product updated successfully!");
      router.push(`/dashboard/products/${productId}`);
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Product not found.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/dashboard/products/${productId}`}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground text-sm">
            Update the details for {product.name}.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Existing Images Management */}
        <div className="rounded-2xl border border-gray-200 bg-card p-6 shadow-xl dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Current Images</h2>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {product.images.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Product image" className="h-full w-full object-cover" />
                  
                  {img.isPrimary && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="default" className="shadow-md bg-blue-500 hover:bg-blue-600 text-white">
                        <Star className="mr-1 size-3 fill-current" /> Primary
                      </Badge>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={isPending}
                      className="rounded-full shadow-sm"
                      title="Delete Image"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    
                    {!img.isPrimary && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSetPrimary(img.id)}
                        disabled={isPending}
                        className="shadow-sm font-medium"
                      >
                        Set Primary
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-xl bg-muted/20">
              <p className="text-sm text-muted-foreground">No images have been uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-card p-6 shadow-xl dark:border-gray-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Zoro Sword Replica"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. zoro-sword-replica"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images Dropzone for NEW images */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <label className="text-sm font-medium leading-none">
                    Upload New Images
                  </label>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Add additional images to this product. If the product has no images, the first one uploaded will become primary.
                  </p>
                </div>
                <ProductImageUploader
                  value={images}
                  onChange={setImages}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product..."
                          className="h-32 resize-none"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. USD, IQD"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. SWORD-001"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <MultiCategorySelect
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Select one or more categories for this product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 bg-background/50 p-4 dark:border-gray-800">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Make this product visible and available for purchase.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isPending}
                >
                  <Link href={`/dashboard/products/${productId}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {isUploadingImages ? "Uploading New Images..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
