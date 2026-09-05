import type { CartItem } from "../services/cart.service";

export interface UICartItem {
  _id: string;
  productId: string;
  productName: string;
  description: string;
  brand: string;
  category: string;
  variantId: string;
  color?: string;
  size: string;
  size_id: string;
  price: number;
  mrp: number;
  quantity: number;
  images: string[];
  product: {
    _id: string;
    name: string;
    slug: string;
    allImages: string[];
  };
}

export function enrichCartItemWithImages(item: CartItem): UICartItem {
  const productId = item?.product_id ?? "";
  const productName = item?.product_name ?? "";
  const variantId = item?.variantId ?? "";
  const size = item?.size ?? "";
  const size_id = item?.size_id ?? "";
  const price = item?.selling_price ?? 0;
  const mrp = item?.mrp ?? price;
  const quantity = item?.quantity ?? 1;
  const images =
    item?.images && item.images.length > 0
      ? item.images
      : ["/placeholder.jpg"];

  return {
    _id: item?._id ?? "",
    productId,
    productName,
    description: item?.description ?? "",
    brand: item?.brand ?? "",
    category: item?.category ?? "",
    variantId,
    color: item?.color ?? "",
    size,
    size_id,
    price,
    mrp,
    quantity,
    images,
    product: {
      _id: productId,
      name: productName,
      slug: productId,
      allImages: images,
    },
  };
}

export function enrichCartItemsWithImages(items: CartItem[]): UICartItem[] {
  if (!Array.isArray(items)) return [];
  return items.map(enrichCartItemWithImages);
}
