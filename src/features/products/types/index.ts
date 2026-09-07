import { CategorySlugEnum } from "@/constants/categories";

export type ProductSortOption =
  | "latest"
  | "price-low"
  | "price-high"
  | "rating";
export type ProductAvailability = "inStock" | "outOfStock" | "preOrder";

export interface ProductVariantSize {
  _id: string;
  size: string;
  quantity: number;
  selling_price: number;
  mrp: number;
  is_cart_active?: boolean;
  is_wishlist?: boolean;
}

export interface ProductVariant {
  _id: string;
  product_id: string;
  color: string;
  sizes: ProductVariantSize[];
  images: string[];
  sku: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  category: string;
  brand: string;
  product_name: string;
  fabric: string;
  description: string;
  is_sale: boolean;
  is_visible: boolean;
  status: string;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  variant: ProductVariant;
  product_variants?: ProductVariant[];
}

export interface ProductsListResponse {
  total: number;
  offset: number;
  limit: number;
  totalPages: number;
  products: Product[];
}

export interface TestimonialsResponse {
  testimonials: unknown[];
}

export interface FilterPriceRange {
  min: number;
  max: number;
}

export interface FilterItemOption {
  name: string;
  count?: number;
}

export interface ColorFilterItem {
  name: string;
  code?: string;
  hex?: string;
  count?: number;
}

export interface FilterOptionsData {
  brands: (string | FilterItemOption)[];
  categories: (string | FilterItemOption)[];
  fabrics: (string | FilterItemOption)[];
  colors: (string | ColorFilterItem)[];
  sizes: (string | FilterItemOption)[];
  price: FilterPriceRange;
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptionsData;
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
  offset?: number;
  limit?: number;
}

export type ProductCategory =
  | "SAREE"
  | "BANARASI_SAREE"
  | "LEHENGA"
  | "BRIDAL_LEHENGA"
  | "RAJPUTI_POSHAK";

export const CATEGORY_TYPE_MAP: Record<string, ProductCategory> = {
  [CategorySlugEnum.SAREES]: "SAREE",
  [CategorySlugEnum.BANARASI_SAREES]: "BANARASI_SAREE",
  [CategorySlugEnum.LEHENGA]: "LEHENGA",
  [CategorySlugEnum.BRIDAL_LEHENGA]: "BRIDAL_LEHENGA",
  [CategorySlugEnum.RAJPUTI_POSHAK]: "RAJPUTI_POSHAK",
};
