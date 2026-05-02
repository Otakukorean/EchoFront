"use client";

import { ArrowLeft, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddVariationDialog } from "@/components/sections/dashboard/add-variation-dialog";
import { useDeleteVariation, useProduct } from "@/lib/features/products/hooks";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [variationToDelete, setVariationToDelete] = useState<string | null>(null);

  const { data: product, isLoading, error } = useProduct(productId);
  const { mutateAsync: deleteVariation, isPending: isDeletingVariation } = useDeleteVariation(productId);

  const handleDeleteVariation = async () => {
    if (!variationToDelete) return;
    try {
      await deleteVariation(variationToDelete);
    } finally {
      setVariationToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/products">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
              {!product.isActive && (
                <Badge variant="secondary">Draft</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              /{product.slug} • SKU: {product.sku}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/products/${productId}/edit`}>
            <Edit className="mr-2 size-4" /> Edit Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Images */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-card shadow-sm dark:border-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images
                .filter((img) => !img.isPrimary)
                .map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-card dark:border-gray-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt="Product variant"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-card p-6 shadow-sm dark:border-gray-800 space-y-6">
            
            {/* Price & Status */}
            <div className="flex items-center justify-between border-b pb-6 border-border">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Price</p>
                <p className="text-3xl font-bold">
                  {product.price} <span className="text-xl font-normal text-muted-foreground">{product.currency}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground mb-1">Categories</p>
                <div className="flex gap-1 flex-wrap justify-end">
                  {product.categories?.map((cat) => (
                    <Badge key={cat.id} variant="outline" className="bg-background">
                      {cat.name}
                    </Badge>
                  ))}
                  {(!product.categories || product.categories.length === 0) && (
                    <span className="text-sm text-muted-foreground">Uncategorized</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {product.description || "No description provided."}
              </div>
            </div>
            
            {/* Variations */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Variations</h3>
                <AddVariationDialog productId={product.id} />
              </div>
              
              {product.variations && product.variations.length > 0 ? (
                <div className="grid gap-3">
                  {product.variations.map((variant) => (
                    <div key={variant.id} className="flex flex-col gap-2 p-3 rounded-lg
                    bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        {variant.url && (
                          <div className="size-10 shrink-0 overflow-hidden rounded-md border bg-card">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={variant.url} alt={variant.value} className="size-full object-cover" />
                          </div>
                        )}
                        {variant.color && !variant.url && (
                          <div 
                            className="size-4 rounded-full border border-border shrink-0" 
                            style={{ backgroundColor: variant.color }} 
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{variant.value}</span>
                          {!variant.active && <span className="text-[10px] text-destructive font-semibold">INACTIVE</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
                        <span className="text-muted-foreground">{variant.quantity} in stock</span>
                        <span className="font-medium text-right min-w-[80px]">
                          {variant.price >= 0 ? '+' : ''}{variant.price} {product.currency}
                        </span>
                        <div className="flex items-center gap-1">
                          <AddVariationDialog productId={product.id} variation={variant} />
                          <Button
                            variant="ghost"
                            size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => setVariationToDelete(variant.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No variations added yet.</p>
                </div>
              )}

              {/* Delete Variation Alert */}
              <AlertDialog open={!!variationToDelete} onOpenChange={(open) => !open && setVariationToDelete(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the variation from the product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeletingVariation}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteVariation();
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeletingVariation}
                    >
                      {isDeletingVariation ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Trash2 className="mr-2 size-4" />}
                      Delete Variation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
