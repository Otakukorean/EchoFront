"use client";

import { Plus, Loader2, Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { useCreateVariation, useUpdateVariation } from "@/lib/features/products/hooks";
import { ProductVariation } from "@/lib/features/products/types";

interface AddVariationDialogProps {
  productId: string;
  variation?: ProductVariation;
}

export function AddVariationDialog({ productId, variation }: AddVariationDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createVariation, isPending: isCreating } = useCreateVariation(productId);
  const { mutateAsync: updateVariation, isPending: isUpdating } = useUpdateVariation(productId);

  const isPending = isCreating || isUpdating;

  // Form state
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (variation) {
        setValue(variation.value);
        setPrice(variation.price.toString());
        setQuantity(variation.quantity.toString());
        setColor(variation.color || "");
        setActive(variation.active);
      } else {
        setValue("");
        setPrice("");
        setQuantity("");
        setColor("");
        setActive(true);
      }
      setFile(null);
    }
  }, [open, variation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !price || !quantity) {
      toast.error("Please fill in all required fields (Value, Price, Quantity).");
      return;
    }

    const formData = new FormData();
    formData.append("value", value);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("active", active.toString());
    
    if (color) {
      formData.append("color", color);
    }
    
    if (file) {
      formData.append("url", file);
    }

    try {
      if (variation) {
        await updateVariation({ variationId: variation.id, formData });
      } else {
        await createVariation(formData);
      }
      setOpen(false);
    } catch (error) {
      toast.error(variation ? "Failed to update variation." : "Failed to add variation.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variation ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          >
            <Edit className="size-4" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full mt-4 sm:w-auto sm:mt-0">
            <Plus className="mr-2 size-4" /> Add Variation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{variation ? "Edit Variation" : "Add Variation"}</DialogTitle>
          <DialogDescription>
            {variation ? "Update the details for this variation." : "Add a new option for your product (e.g., Size, Color, Material)."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="var-value">Value <span className="text-destructive">*</span></Label>
              <Input
                id="var-value"
                placeholder="e.g. Large, Red, etc."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="var-color">Color Hex (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="var-color"
                  placeholder="#000000"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={isPending}
                />
                <div 
                  className="size-10 rounded-md border shrink-0" 
                  style={{ backgroundColor: color || 'transparent' }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="var-price">Price Adjustment <span className="text-destructive">*</span></Label>
              <Input
                id="var-price"
                type="number"
                step="0.01"
                placeholder="e.g. 5.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="var-quantity">Stock Quantity <span className="text-destructive">*</span></Label>
              <Input
                id="var-quantity"
                type="number"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Variation Image (Optional)</Label>
            <FileUpload
              value={file}
              onChange={setFile}
              defaultUrl={variation?.url}
              label={variation?.url ? "Replace image" : "Upload variation image"}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Make this variation available for purchase.
              </p>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {variation ? "Save Changes" : "Save Variation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
