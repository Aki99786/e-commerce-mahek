import { Suspense } from "react";
import { CategoryPageContent } from "@/features/products/components/CategoryPageContent";

export function generateStaticParams() {
  return [];
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
