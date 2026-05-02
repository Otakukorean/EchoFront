export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
