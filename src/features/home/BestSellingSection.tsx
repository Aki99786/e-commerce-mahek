"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { productService } from "@/features/products/services/product.service";
import { ROUTES } from "@/constants/routes";
import { adaptAPIProductToUI } from "@/features/products/utils/product-adapter";
import type { Product } from "@/types/product";

export const BestSellingSection = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await productService.getBestSellingProducts();
        const mappedProducts = response.products.map(adaptAPIProductToUI);
        setBestSellingProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch best selling products:", error);
        setBestSellingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  return (
    <section className="py-8 md:py-10 lg:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-playfair tracking-tight">
            Best Selling
          </h2>
          <Link
            href={ROUTES.SHOP}
            className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors font-poppins"
          >
            View All {"->"}
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[200px] h-[300px] bg-gray-200 animate-pulse rounded-lg flex-shrink-0" />
            ))}
          </div>
        ) : (
          <ProductCarousel products={bestSellingProducts} slidesToShow={5} />
        )}
      </div>
    </section>
  );
};
