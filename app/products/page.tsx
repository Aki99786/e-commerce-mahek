import type { Metadata } from "next";
import { Suspense } from "react";
import { generateSEO } from "@/lib/utils/seo";
import { CategoryPageContent } from "@/features/products/components/CategoryPageContent";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export const metadata: Metadata = {
  ...generateSEO({
    title: "All Products — Sarees, Lehengas & Ethnic Wear",
    description:
      "Browse Mahek's full collection of premium Indian ethnic wear: silk sarees, bridal lehengas, Rajputi Poshak, Anarkalis and more. Filter by category, price and style.",
    keywords: [
      "shop sarees online",
      "lehenga choli",
      "ethnic wear collection",
      "Indian traditional dress",
      "silk sarees India",
      "bridal lehenga collection",
    ],
  }),
};

export function generateStaticParams() {
  return [];
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <CategoryPageContent />
    </Suspense>
  );
}
