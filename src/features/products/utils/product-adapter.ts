import type { Product as APIProduct } from "../types";
import type { Product as UIProduct } from "@/types/product";
import { ProductLabelType, StockStatus } from "@/types/product";

export function adaptAPIProductToUI(apiProduct: APIProduct): UIProduct {
  const variants = apiProduct.variants || [];
  const prices = variants.map((v) => v.sellingPrice);
  const mrps = variants.map((v) => v.mrp);
  const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
  const maxMrp = mrps.length > 0 ? Math.max(...mrps) : undefined;

  const avgDiscount =
    minPrice !== undefined && maxMrp !== undefined && maxMrp > 0
      ? Math.round(((maxMrp - minPrice) / maxMrp) * 100)
      : 0;
  const hasDiscount = avgDiscount > 0;

  const stockStatus =
    apiProduct.totalStock > 0 ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK;

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 150);
  };

  const imageUrls =
    apiProduct.allImages && apiProduct.allImages.length > 0
      ? apiProduct.allImages
      : apiProduct.variants.flatMap((v) => v.images || []);

  return {
    id: apiProduct._id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    shortDescription: stripHtml(apiProduct.description || ""),
    images: imageUrls.map((url) => ({
      url: url,
      alt: apiProduct.name,
    })),
    price: {
      current: minPrice,
      original:
        maxMrp !== undefined && minPrice !== undefined && maxMrp > minPrice
          ? maxMrp
          : undefined,
      discount: hasDiscount ? avgDiscount : undefined,
    },
    rating: {
      average: apiProduct.averageRating || 0,
      count: apiProduct.totalReviews || 0,
    },
    category: apiProduct.category,
    categorySlug: apiProduct.category.toLowerCase().replace(/_/g, "-"),
    stockStatus,
    featured: apiProduct.isFeatured || false,
    bestseller: apiProduct.isFeatured || false,
    trending: apiProduct.isFeatured || false,
    colors:
      apiProduct.allColors?.map((color) => ({
        name: color,
        image: "",
        available: true,
      })) || [],
    sizes:
      apiProduct.allSizes?.map((size) => ({
        name: size,
        available: true,
      })) || [],
    features: [],
    fabric: apiProduct.fabric || "Viscose",
    sku: apiProduct._id.substring(0, 8).toUpperCase(),
    label: hasDiscount
      ? {
          type: ProductLabelType.SALE,
          text: `${avgDiscount}% OFF`,
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
