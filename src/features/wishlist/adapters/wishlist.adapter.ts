import type { WishlistItem, WishlistProduct } from "../types";

export interface UIWishlistProduct extends WishlistProduct {
  price: number;
  oldPrice: number;
  discountPercent: number;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  totalStock: number;
  images: string[];
  selectedColor: string;
}

export interface UIWishlistItem extends Omit<WishlistItem, "product"> {
  product: UIWishlistProduct;
}

export function adaptWishlistItemToUI(item: WishlistItem): UIWishlistItem {
  const selectedVariant = item.product.variants.find(
    (v) => v.variantId === item.variantId
  );

  if (!selectedVariant) {
    throw new Error(`Variant ${item.variantId} not found for product ${item.product._id}`);
  }

  // sizes can be [null] for single-size items (e.g., sarees) — filter before summing
  const totalStock = selectedVariant.sizes
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .reduce((sum, sizeItem) => sum + sizeItem.stock, 0);

  const discountPercent = selectedVariant.mrp > 0
    ? Math.round(((selectedVariant.mrp - selectedVariant.sellingPrice) / selectedVariant.mrp) * 100)
    : 0;

  let availability: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  if (totalStock === 0) {
    availability = "OUT_OF_STOCK";
  } else if (totalStock <= 5) {
    availability = "LOW_STOCK";
  } else {
    availability = "IN_STOCK";
  }

  return {
    ...item,
    _id: item._id || `${item.product._id}-${item.variantId}-${item.size}`,
    product: {
      ...item.product,
      price: selectedVariant.sellingPrice,
      oldPrice: selectedVariant.mrp,
      discountPercent,
      availability,
      totalStock,
      images: selectedVariant.images,
      selectedColor: selectedVariant.color,
    },
  };
}

export function adaptWishlistResponseToUI(items: WishlistItem[]): UIWishlistItem[] {
  return items.map(adaptWishlistItemToUI);
}
