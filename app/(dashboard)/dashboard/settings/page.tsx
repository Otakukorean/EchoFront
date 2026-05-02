"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Store as StoreIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { useMyStore, useUpdateStore } from "@/lib/features/stores/hooks";
import { updateStoreSchema, type UpdateStoreFormData } from "@/lib/features/stores/validations";

export default function StoreSettingsPage() {
  const { data: store, isLoading } = useMyStore();
  const { mutateAsync: updateStoreAsync, isPending: isUpdating } = useUpdateStore();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const form = useForm<UpdateStoreFormData>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Pre-populate form when store loads
  useEffect(() => {
    if (store) {
      form.reset({
        name: store.name,
        slug: store.slug,
        description: store.description || "",
      });
    }
  }, [store, form]);

  const onSubmit = async (values: UpdateStoreFormData) => {
    try {
      await updateStoreAsync({
        ...values,
        Logo: logoFile || undefined,
        Cover: coverFile || undefined,
      });
      // Optionally reset files state so it doesn't upload again unnecessarily on next save
      setLogoFile(null);
      setCoverFile(null);
    } catch (error) {
      toast.error("Failed to update store settings.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <h2 className="text-xl font-semibold">Store not found.</h2>
      </div>
    );
  }

  return (
    <main className="container relative z-10 mx-auto max-w-3xl px-4 mt-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
          <StoreIcon className="size-6 text-brand" />
          Store Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Update your store's branding and information.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background flair */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            {/* Branding Section */}
            <div className="space-y-6 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold tracking-tight">Branding</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <FileUpload
                    value={logoFile}
                    onChange={setLogoFile}
                    defaultUrl={store.logoUrl}
                    label="Upload a new logo"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Recommended size: 512x512px.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Store Cover (Optional)</Label>
                  <FileUpload
                    value={coverFile}
                    onChange={setCoverFile}
                    defaultUrl={store.coverUrl}
                    label="Upload a new cover"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Recommended size: 1200x400px.
                  </p>
                </div>
              </div>
            </div>

            {/* General Info Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold tracking-tight">General Information</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Awesome Store"
                          {...field}
                          disabled={isUpdating}
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
                      <FormLabel>Store Slug / URL</FormLabel>
                      <FormControl>
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                            echo.com/
                          </span>
                          <Input
                            placeholder="my-store"
                            className="rounded-l-none"
                            {...field}
                            disabled={isUpdating}
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
                        placeholder="Tell your customers what your store is about..."
                        className="h-32 resize-none"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isUpdating} size="lg">
                {isUpdating ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
