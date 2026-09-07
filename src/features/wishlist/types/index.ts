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

export interface WishlistVariantSize {
  _id: string;
  size: string;
  quantity: number;
  selling_price: number;
  mrp: number;
}

export interface WishlistVariant {
  variant_id: string;
  size_id: string;
  images: string[];
  color: string;
  size: WishlistVariantSize;
}

export interface WishlistItem {
  _id: string;
  product_id: string;
  product_name: string;
  brand: string;
  description: string;
  variant: WishlistVariant;
}

export interface WishlistResponse {
  success: boolean;
  total: number;
  offset: number;
  limit: number;
  list: WishlistItem[];
}

export interface GetWishlistParams {
  limit?: number;
  offset?: number;
}

export interface WishlistItemPayload {
  productId: string;
  variantId: string;
  size_id?: string;
  size: string;
}

export interface AddToWishlistRequest {
  wishlistItems: WishlistItemPayload[];
}

export type AddToWishlistInput =
  | AddToWishlistRequest
  | WishlistItemPayload
  | WishlistItemPayload[];

export interface RemoveFromWishlistRequest {
  id?: string;
  wishlistItemId?: string;
  productId?: string;
  variantId?: string;
  size?: string;
}

export interface MoveToCartRequest {
  productId: string;
  variantId: string;
  size: string;
}

export interface BulkMoveToCartItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity?: number;
  size_id?: string;
  size: string;
}

export interface BulkMoveToCartRequest {
  cartItems: BulkMoveToCartItem[];
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
