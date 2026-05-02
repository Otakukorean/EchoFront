"use client";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/lib/features/categories/hooks";
import { cn } from "@/lib/utils";

interface MultiCategorySelectProps {
  value?: string[];
  onChange?: (categoryIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiCategorySelect({
  value = [],
  onChange,
  placeholder = "Select categories...",
  className,
}: MultiCategorySelectProps) {
  const [open, setOpen] = React.useState(false);
  const { data: categories = [], isLoading } = useCategories();

  const selectedCategories = categories.filter((cat) => value.includes(cat.id));

  const toggleCategory = (categoryId: string) => {
    const isSelected = value.includes(categoryId);
    if (isSelected) {
      onChange?.(value.filter((id) => id !== categoryId));
    } else {
      onChange?.([...value, categoryId]);
    }
  };

  const removeCategory = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    onChange?.(value.filter((id) => id !== categoryId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 px-3 py-2",
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading categories...</span>
            </div>
          ) : selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="secondary"
                  className="mr-1 mb-1 bg-muted hover:bg-muted/80 text-xs py-0.5 rounded-sm"
                >
                  {cat.name}
                  <div
                    role="button"
                    tabIndex={0}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        removeCategory(e as any, cat.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => removeCategory(e, cat.id)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground font-normal">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => {
                const isSelected = value.includes(category.id);
                return (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => toggleCategory(category.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
