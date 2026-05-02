"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import EchoLogo from "@/components/logos/echo";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateStore } from "@/lib/features/stores/hooks";
import {
  CreateStoreFormData,
  createStoreSchema,
} from "@/lib/features/stores/validations";

export default function CreateStorePage() {
  const { mutate: createStore, isPending } = useCreateStore();

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      Logo: undefined,
      Cover: undefined,
    },
  });

  const onSubmit = (data: CreateStoreFormData) => {
    createStore(data);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-12">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-brand/10 absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header with Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <EchoLogo className="size-7" />
            Echo
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your store
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill out the details below to set up your new Echo storefront.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border-gray-200 dark:border-gray-800 rounded-2xl border p-6 md:p-8 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Store Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. My Awesome Store"
                        disabled={isPending}
                        {...field}
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
                    <FormLabel>Store URL Slug</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="flex h-9 items-center rounded-l-md bg-muted px-3 text-sm text-muted-foreground">
                          echo.com/
                        </span>
                        <Input
                          placeholder="my-awesome-store"
                          className="rounded-l-none"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell customers what your store is about..."
                      className="resize-none"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-medium">Branding</h2>
                <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="Logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload logo"
                      />
                    </FormControl>
                    <FormDescription>
                      Required. Recommended size: 512x512px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image (Optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload cover"
                      />
                    </FormControl>
                    <FormDescription>
                      Recommended size: 1200x400px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} size="lg" className="w-full sm:w-auto">
                  {isPending ? "Creating..." : "Create Store"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
