"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { useCreateProduct } from "@/lib/features/products/hooks";
import { createProductSchema, type CreateProductFormValues } from "@/lib/features/products/validations";

export default function CreateProductPage() {
  const router = useRouter();
  const { mutateAsync: createProductAsync, isPending: isCreatingProduct } = useCreateProduct();
  const [images, setImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const isPending = isCreatingProduct || isUploadingImages;

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

  const onSubmit = async (values: CreateProductFormValues) => {
    try {
      // 1. Create product
      const product = await createProductAsync(values);
      
      // 2. Upload images
      if (images.length > 0) {
        setIsUploadingImages(true);
        try {
          await Promise.all(
            images.map((file, index) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("isPrimary", index === 0 ? "true" : "false");
              formData.append("index", index.toString());
              
              return ProductsService.uploadImage(product.id, formData);
            })
          );
        } catch (imageError) {
          toast.error("Product created, but some images failed to upload.");
          router.push("/dashboard/products");
          return;
        } finally {
          setIsUploadingImages(false);
        }
      }
      
      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product.");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/products">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground text-sm">
            Add a new product to your store inventory.
          </p>
        </div>
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

            {/* Images Dropzone */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Product Images
                </label>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Upload multiple product images. Drag to reorder. The first image is automatically set as the primary cover.
                </p>
              </div>
              <ProductImageUploader
                value={images}
                onChange={setImages}
              />
            </div>

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
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {isUploadingImages ? "Uploading Images..." : "Creating Product..."}
                  </>
                ) : (
                  <>
                    <PackagePlus className="mr-2 size-4" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
