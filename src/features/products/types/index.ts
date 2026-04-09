export interface ProductVariantSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  variantId: string;
  color: string;
  sellingPrice: number;
  mrp: number;
  sizes: ProductVariantSize[];
  images: string[];
  sizeDetails: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  pattern: string;
  sleeveType: string;
  fabric: string;
  neckType: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
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

export interface ProductsListParams {
  type?: string;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-low" | "price-high" | "newest" | "popular" | "rating";
  color?: string;
  size?: string;
  availability?: "IN_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";
  page?: number;
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
