export enum Availability {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
}

export interface WishlistProductVariantSize {
  size: string;
  stock: number;
}

export interface WishlistProductVariant {
  variantId: string;
  color: string;
  sellingPrice: number;
  mrp: number;
  sizes: (WishlistProductVariantSize | null)[]; // null for single-size items like sarees
  images: string[];
  sizeDetails: string;
}

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  allImages: string[];
  allColors: string[];
  allSizes: string[];
  variants: WishlistProductVariant[];
  averageRating: number;
  totalReviews: number;
  reviews: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  _id?: string;
  product: WishlistProduct;
  variantId: string;
  size: string;
  addedAt?: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total?: number; // API may not return this field
}

export interface AddToWishlistRequest {
  productId: string;
  variantId: string;
  size: string;
}

export interface RemoveFromWishlistRequest {
  productId: string;
  variantId: string;
  size: string;
}

export interface MoveToCartRequest {
  productId: string;
  variantId: string;
  size: string;
}

export interface BulkMoveToCartItem {
  productId: string;
  variantId: string;
  size: string;
}

export interface BulkMoveToCartRequest {
  items: BulkMoveToCartItem[];
}

export interface BulkMoveToCartResponse {
  message: string;
  movedCount: number;
}

export interface AddToCartRequest {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}
