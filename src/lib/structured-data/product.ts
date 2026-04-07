import type { Product } from "@/types/product";
import { SITE_CONFIG } from "@/constants/site";

export const generateProductSchema = (product: Product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.images.map((img) => img.url),
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/category/${product.category}`,
      priceCurrency: SITE_CONFIG.currency,
      price: product.price.current ?? 0,
      availability:
        product.stockStatus === "in-stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
      },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.average,
        reviewCount: product.rating.count,
      },
    }),
  };
};
