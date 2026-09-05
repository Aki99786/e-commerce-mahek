import type { Product as APIProduct } from "../types";
import type { Product as UIProduct } from "@/types/product";
import { ProductLabelType, StockStatus } from "@/types/product";

export function adaptAPIProductToUI(apiProduct: APIProduct): UIProduct {
  const variant = apiProduct.variant || apiProduct.product_variants?.[0];
  const sizes = variant?.sizes || [];
  const prices = sizes.map((s) => s.selling_price);
  const mrps = sizes.map((s) => s.mrp);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxMrp = mrps.length > 0 ? Math.max(...mrps) : 0;

  const discount =
    maxMrp > minPrice && maxMrp > 0
      ? Math.round(((maxMrp - minPrice) / maxMrp) * 100)
      : 0;
  const hasDiscount = discount > 0;

  const totalStock = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const stockStatus =
    totalStock > 0 ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK;

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 150);
  };

  const imageUrls = variant?.images || [];

  return {
    id: apiProduct._id,
    brand: apiProduct.brand || "Brand",
    name: apiProduct.product_name,
    slug: apiProduct._id,
    description: apiProduct.description || "",
    shortDescription: stripHtml(apiProduct.description || ""),
    images: imageUrls.map((url) => ({
      url: url,
      alt: apiProduct.product_name,
    })),
    price: {
      current: minPrice,
      original: maxMrp > minPrice ? maxMrp : undefined,
      discount: hasDiscount ? discount : undefined,
    },
    rating: {
      average: 0,
      count: 0,
    },
    category: apiProduct.category,
    categorySlug: apiProduct.category.toLowerCase().replace(/_/g, "-"),
    stockStatus,
    featured: apiProduct.is_sale || false,
    bestseller: false,
    trending: false,
    colors: variant?.color
      ? [
          {
            name: variant.color,
            image: variant.images[0] || "",
            available: totalStock > 0,
          },
        ]
      : [],
    sizes: sizes.map((size) => ({
      name: size.size,
      available: size.quantity > 0,
    })),
    features: [],
    fabric: apiProduct.fabric || "",
    sku: variant?.sku || apiProduct._id.substring(0, 8).toUpperCase(),
    label: hasDiscount
      ? {
          type: ProductLabelType.SALE,
          text: `${discount}% OFF`,
        }
      : stockStatus === StockStatus.OUT_OF_STOCK
        ? {
            type: ProductLabelType.SOLD_OUT,
            text: "SOLD OUT",
          }
        : undefined,
    washingInstructions: {},
  };
}
