import { Availability } from "../types";
import type { WishlistItem, WishlistProduct } from "../types";

export interface UIWishlistProduct extends Partial<WishlistProduct> {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  availability: Availability;
  totalStock: number;
  images: string[];
  selectedColor?: string;
}

export interface UIWishlistItem extends WishlistItem {
  variantId: string;
  sizeId?: string;
  size: string;
  product: UIWishlistProduct;
}

export function adaptWishlistItemToUI(item: WishlistItem): UIWishlistItem {
  const sellingPrice = item?.variant?.size?.selling_price ?? 0;
  const mrp = item?.variant?.size?.mrp ?? sellingPrice;
  const stock = item?.variant?.size?.quantity ?? 0;
  const images = item?.variant?.images ?? [];
  const selectedColor = item?.variant?.color ?? "";
  const sizeName = item?.variant?.size?.size ?? "";

  const discountPercent =
    mrp > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  let availability: Availability;
  if (stock === 0) {
    availability = Availability.OUT_OF_STOCK;
  } else if (stock <= 5) {
    availability = Availability.LOW_STOCK;
  } else {
    availability = Availability.IN_STOCK;
  }

  return {
    _id: item?._id ?? "",
    product_id: item?.product_id ?? "",
    product_name: item?.product_name ?? "",
    brand: item?.brand ?? "",
    description: item?.description ?? "",
    variantId: item?.variant?.variant_id ?? "",
    sizeId: item?.variant?.size_id ?? "",
    size: sizeName,
    variant: item?.variant,
    product: {
      _id: item?.product_id ?? "",
      name: item?.product_name ?? "",
      brand: item?.brand ?? "",
      description: item?.description ?? "",
      price: sellingPrice,
      oldPrice: mrp,
      discountPercent,
      availability,
      totalStock: stock,
      images,
      selectedColor,
      slug: "",
      category: "",
      isActive: true,
      isFeatured: false,
      allImages: images,
      allColors: selectedColor ? [selectedColor] : [],
      allSizes: sizeName ? [sizeName] : [],
      variants: [],
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
      createdAt: "",
      updatedAt: "",
    },
  };
}

export function adaptWishlistResponseToUI(
  items: WishlistItem[],
): UIWishlistItem[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map(adaptWishlistItemToUI);
}
