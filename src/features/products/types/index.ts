export type ProductSortOption =
  | "latest"
  | "price-low"
  | "price-high"
  | "rating";
export type ProductAvailability = "inStock" | "outOfStock" | "preOrder";

export interface ProductVariantSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  _id: string;
  variantId: string;
  color: string;
  sellingPrice: number;
  mrp: number;
  sizes: ProductVariantSize[];
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  pattern: string;
  sleeveType?: string;
  fabric: string;
  neckType?: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isPreOrder?: boolean;
  avgPrice: number;
  totalStock: number;
  allImages: string[];
  allColors: string[];
  allSizes: string[];
  variants: ProductVariant[];
  averageRating: number;
  totalReviews: number;
  reviews: unknown[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductsListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  products: Product[];
}

export interface TestimonialsResponse {
  testimonials: unknown[];
}

export interface ProductsListParams {
  category?: string;
  subCategory?: string;
  brand?: string;
  type?: string;
  color?: string;
  size?: string;
  fabric?: string;
  pattern?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: ProductAvailability;
  isFeatured?: boolean;
  search?: string;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductCategory =
  | "SAREE"
  | "BANARASI_SAREE"
  | "LEHENGA"
  | "BRIDAL_LEHENGA"
  | "RAJPUTI_POSHAK";

export const CATEGORY_TYPE_MAP: Record<string, ProductCategory> = {
  sarees: "SAREE",
  "banarasi-sarees": "BANARASI_SAREE",
  lehenga: "LEHENGA",
  "bridal-lehenga": "BRIDAL_LEHENGA",
  "rajputi-poshak": "RAJPUTI_POSHAK",
};
