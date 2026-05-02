"use client";

import { Loader2, Plus, Tags } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateCategory,
} from "@/lib/features/categories/hooks";

import { CategoryCard } from "./category-card";

export function CategoriesSheet() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const [isAdding, setIsAdding] = useState(false);
  
  // New category form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    
    createCategory(
      { name, slug, description },
      {
        onSuccess: () => {
          // Reset form on successful creation
          setName("");
          setSlug("");
          setDescription("");
          setIsAdding(false);
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 bg-card">
          <Tags className="mr-2 size-4 text-muted-foreground" />
          Categories
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Categories</SheetTitle>
          <SheetDescription>
            Organize your products into categories to help customers find what they want.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6 flex-1">
          {/* Create New Category Section */}
          {!isAdding ? (
            <Button 
              onClick={() => setIsAdding(true)} 
              className="w-full bg-muted text-foreground hover:bg-muted/80 border border-dashed border-muted-foreground/30"
              variant="outline"
            >
              <Plus className="mr-2 size-4" /> Add New Category
            </Button>
          ) : (
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="font-medium mb-4 text-sm">New Category</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Name</Label>
                  <Input 
                    id="cat-name" 
                    placeholder="e.g. Action Figures" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isCreating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-slug">Slug</Label>
                  <Input 
                    id="cat-slug" 
                    placeholder="e.g. action-figures" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={isCreating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description (Optional)</Label>
                  <Textarea 
                    id="cat-desc" 
                    placeholder="Category description..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isCreating}
                    className="resize-none h-20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* List of Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">Existing Categories</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No categories found.</p>
            ) : (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
