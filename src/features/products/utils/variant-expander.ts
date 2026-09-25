import type { Product as APIProduct, ProductVariant } from "../types";

export interface ExpandedVariantProduct extends APIProduct {
  selectedVariantId: string;
  selectedVariant: ProductVariant;
  allImages: string[];
  allColors: string[];
  allSizes: string[];
  avgPrice: number;
  totalStock: number;
}

/**
 * Expands a product into multiple products, one per variant
 * Each expanded product represents a specific color variant
 */
export function expandProductVariants(
  apiProduct: APIProduct,
): ExpandedVariantProduct[] {
  const variants =
    apiProduct.product_variants && apiProduct.product_variants.length > 0
      ? apiProduct.product_variants
      : apiProduct.variant
        ? [apiProduct.variant]
        : [];

  if (variants.length === 0) {
    return [];
  }

  return variants.map((variant) => {
    // Filter out null/undefined sizes
    const validSizes = (variant.sizes || []).filter(
      (s) => s !== null && s !== undefined && s.size,
    );

    const sizes =
      validSizes.length > 0
        ? validSizes
        : [
            {
              _id: "",
              size: "ONE_SIZE",
              quantity: 0,
              selling_price: 0,
              mrp: 0,
            },
          ];

    const firstSize = sizes[0];
    const totalStock = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);

    return {
      ...apiProduct,
      selectedVariantId: variant._id,
      selectedVariant: {
        ...variant,
        sizes: sizes,
      },
      allImages: variant.images || [],
      allColors: [variant.color],
      allSizes: sizes.map((s) => s.size),
      avgPrice: firstSize.selling_price,
      totalStock,
    };
  });
}
