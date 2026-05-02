import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  sku: z.string().min(1, "SKU is required"),
  isActive: z.boolean().default(true),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
