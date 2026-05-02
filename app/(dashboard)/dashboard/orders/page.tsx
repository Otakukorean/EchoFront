"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders, useUpdateOrderStatus } from "@/lib/features/orders/hooks";
import type { OrderStatus } from "@/lib/features/orders/types";
import { cn } from "@/lib/utils";

const ORDER_STATUSES: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Confirmed":
    case "Processing":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Shipped":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "Delivered":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Cancelled":
    case "Refunded":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function OrdersPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const pageSize = 10;

  const { data, isLoading, isFetching } = useOrders(pageIndex, pageSize, status);
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const orders = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as OrderStatus | "All");
    setPageIndex(0); // Reset to first page when filtering
  };

  return (
    <main className="container relative z-10 mx-auto max-w-6xl px-4 mt-10">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
            <ShoppingCart className="size-6 text-brand" />
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Status:</span>
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[160px] bg-card h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All Orders" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
        {/* Loading Overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-brand" />
          </div>
        )}

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingCart className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No orders found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {status === "All"
                ? "You don't have any orders yet. Once customers make purchases, they'll appear here."
                : `No orders match the status "${status}". Try changing the filter.`}
            </p>
            {status !== "All" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleStatusChange("All")}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-mono font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(order.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => 
                          updateStatus({ orderId: order.id, status: val as OrderStatus })
                        }
                      >
                        <SelectTrigger 
                          className={cn(
                            "h-8 w-[130px] shadow-none", 
                            getStatusColor(order.status)
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.filter(s => s !== "All").map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {order.itemCount}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && orders.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{pageIndex * pageSize + 1}</span> to{" "}
            <span className="font-medium text-foreground">
              {Math.min((pageIndex + 1) * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalCount}</span> orders
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0 || isFetching}
              className="h-9"
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2 text-sm font-medium">
              Page {pageIndex + 1} of {Math.max(1, totalPages)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={pageIndex >= totalPages - 1 || isFetching}
              className="h-9"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
