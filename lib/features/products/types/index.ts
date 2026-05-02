export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  index: number;
}

export interface ProductVariation {
  id: string;
  value: string;
  price: number;
  active: boolean;
  color: string;
  url: string;
  quantity: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
  sku: string;
  categories: ProductCategory[];
  images: ProductImage[];
  variations: ProductVariation[];
}

export interface PaginatedProducts {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  items: Product[];
}

export interface GetProductsResponse {
  products: PaginatedProducts;
}

export interface GetProductResponse {
  product: Product;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
  sku: string;
  categoryIds: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
