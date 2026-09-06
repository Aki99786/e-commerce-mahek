import { Suspense } from "react";
import { CategoryPageContent } from "@/features/products/components/CategoryPageContent";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

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
