import type { CartItem } from "../services/cart.service";

export interface UICartItem extends CartItem {
  images: string[];
}

export function enrichCartItemWithImages(item: CartItem): UICartItem {
  // Find the selected variant matching item.variantId
  const currentVariant = item.product?.variants?.find(
    (variant) => variant.variantId === item.variantId
  );

  // Fallback order for images:
  // 1. Selected variant images
  // 2. Any other variant images if selected variant has no images
  // 3. Product allImages or existing item images
  const images =
    (currentVariant?.images?.length ? currentVariant.images : null) ||
    item.product?.variants?.find((v) => v.images && v.images.length > 0)?.images ||
    item.product?.allImages ||
    item.images ||
    [];

  return {
    ...item,
    images,
  };
}

export function enrichCartItemsWithImages(items: CartItem[]): UICartItem[] {
  return items.map(enrichCartItemWithImages);
}
