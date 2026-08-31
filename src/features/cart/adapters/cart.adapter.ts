import type { CartItem } from "../services/cart.service";
import { productService } from "@/features/products/services/product.service";

export interface UICartItem extends CartItem {
  images: string[];
}

export async function enrichCartItemWithImages(item: CartItem): Promise<UICartItem> {
  if (item.images && item.images.length > 0) {
    return { ...item, images: item.images };
  }

  if (item.product?.allImages && item.product.allImages.length > 0) {
    return { ...item, images: item.product.allImages };
  }

  try {
    const product = await productService.getProductById(item.product._id);
    
    const variant = product.variants.find(v => v.variantId === item.variantId);
    
    const images = variant?.images || product.allImages || [];
    
    return {
      ...item,
      images,
    };
  } catch (error) {
    console.error(`Failed to fetch images for product ${item.product._id}:`, error);
    return {
      ...item,
      images: [],
    };
  }
}

export async function enrichCartItemsWithImages(items: CartItem[]): Promise<UICartItem[]> {
  return Promise.all(items.map(enrichCartItemWithImages));
}
