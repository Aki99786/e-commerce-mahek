import type { Product as UIProduct } from "@/types/product";
import { ProductLabelType, StockStatus } from "@/types/product";
import type { ExpandedVariantProduct } from "./variant-expander";

/**
 * Adapts an expanded variant product to UI Product format
 * Each variant is treated as a separate product with specific color, price, and images
 */
export function adaptExpandedVariantToUI(
  expandedProduct: ExpandedVariantProduct,
): UIProduct {
  const variant = expandedProduct.selectedVariant;
  const firstSize = variant.sizes[0];
  const sellingPrice = firstSize ? firstSize.selling_price : 0;
  const mrp = firstSize ? firstSize.mrp : 0;
  const discount =
    mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;
  const hasDiscount = discount > 0;
  const totalStock = (variant.sizes || []).reduce(
    (sum, s) => sum + (s?.quantity || 0),
    0,
  );
  const stockStatus =
    totalStock > 0 ? StockStatus.IN_STOCK : StockStatus.OUT_OF_STOCK;

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 150);
  };

  // Capitalize first letter of color
  const colorName = variant.color
    ? variant.color.charAt(0).toUpperCase() + variant.color.slice(1)
    : "Unknown";

  const variantImages = variant.images || [];

  return {
    id: expandedProduct._id,
    brand: expandedProduct.brand || "Brand",
    name: `${expandedProduct.product_name} (${colorName})`,
    slug: expandedProduct._id,
    description: expandedProduct.description || "",
    shortDescription: stripHtml(expandedProduct.description || ""),
    images: variantImages.map((url) => ({
      url: url,
      alt: `${expandedProduct.product_name} - ${colorName}`,
    })),
    price: {
      current: sellingPrice,
      original: mrp > sellingPrice ? mrp : undefined,
      discount: hasDiscount ? discount : undefined,
    },
    rating: {
      average: 0,
      count: 0,
    },
    category: expandedProduct.category,
    categorySlug: expandedProduct.category.toLowerCase().replace(/_/g, "-"),
    stockStatus,
    featured: expandedProduct.is_sale || false,
    bestseller: false,
    trending: false,
    colors: [
      {
        name: variant.color,
        image: variant.images[0] || "",
        available: totalStock > 0,
      },
    ],
    sizes: variant.sizes.map((size) => ({
      name: size.size,
      available: size.quantity > 0,
    })),
    features: [],
    fabric: expandedProduct.fabric || "",
    sku: variant.sku || expandedProduct._id.substring(0, 8).toUpperCase(),
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
