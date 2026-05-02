"use client";

import {
  Box,
  Globe,
  Loader2,
  Percent,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyStore } from "@/lib/features/stores/hooks";
import { CategoriesSheet } from "@/components/sections/dashboard/categories-sheet";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProductsInfinite } from "@/lib/features/products/hooks";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function ProductsPageContent() {
  const { data: store } = useMyStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const storeSlug = store?.slug || "my-awesome-store";

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProductsInfinite(10, debouncedSearch);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router]); // omitted searchParams to avoid loop

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>

      <main className="container relative z-10 mx-auto max-w-6xl px-4 mt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            Products
          </h1>
          <Button
            variant="outline"
            className="rounded-full border-blue-200 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30"
            size="sm"
            asChild
          >
            <Link href={`/${storeSlug}`} target="_blank">
              {storeSlug}.echo.com <Globe className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Search */}
          <div className="flex items-center w-full sm:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 bg-card"
            />
          </div>

          {/* Right Tools */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <CategoriesSheet />

            <Select defaultValue="za">
              <SelectTrigger className="w-[110px] bg-card h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">A - Z</SelectItem>
                <SelectItem value="za">Z - A</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-9 w-9 bg-card">
              <Percent className="size-4 text-muted-foreground" />
            </Button>

            <Button className="h-9 ml-1 sm:ml-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => router.push(`/dashboard/products/create`)}>
              <Plus className="mr-1.5 size-4" /> New
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="mt-16 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-card py-20 dark:border-gray-800">
            <Box className="size-10 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              You haven't added any products yet. Click the "New" button to add your first product.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.isPrimary)?.url ||
                "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80"; // Fallback image

              return (
                <Link key={product.id} href={`/dashboard/products/${product.id}`} className="group cursor-pointer flex flex-col">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-gray-200 bg-card border dark:border-gray-800 shadow-sm transition-shadow hover:shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {!product.isActive && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          Draft
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 px-1">
                    <h3 className="text-sm font-bold tracking-tight text-foreground truncate">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-foreground">
                        {product.price} {product.currency}
                      </span>
                      {product.sku && (
                        <span className="text-muted-foreground font-mono truncate max-w-[80px]">
                          {product.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Trigger & Loader */}
        <div ref={ref} className="mt-16 flex justify-center pb-8 h-10">
          {isFetchingNextPage && (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          )}
          {!hasNextPage && products.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              End of list ({data?.pages[0]?.totalCount} products)
            </span>
          )}
        </div>
      </main>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
