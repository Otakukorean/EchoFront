import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileSchema = z
  .custom<File>((val) => val instanceof File, "File is required")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Max file size is 5MB."
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

const optionalFileSchema = z
  .custom<File>((val) => val instanceof File, "Must be a valid file")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Max file size is 5MB."
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  )
  .optional()
  .nullable();

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(50, "Store name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  Logo: fileSchema,
  Cover: optionalFileSchema,
});

export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(50, "Store name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  Logo: optionalFileSchema,
  Cover: optionalFileSchema,
});

export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;
