"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { productService } from "@/features/products/services/product.service";
import { ROUTES } from "@/constants/routes";
import { adaptAPIProductToUI } from "@/features/products/utils/product-adapter";
import type { Product } from "@/types/product";
import type { Product as APIProduct } from "@/features/products/types";

export const BestSellingSection = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [rawAPIProducts, setRawAPIProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await productService.getBestSellingProducts();
        const mappedProducts = response.products.map(adaptAPIProductToUI);
        setBestSellingProducts(mappedProducts);
        setRawAPIProducts(response.products);
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
    <section className="bg-[#F4F3F3] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#111212] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Best Selling
            </h2>
          </div>
          <Link
            href={ROUTES.SHOP}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] font-bold text-[#111212] uppercase border-b border-[#111212] hover:opacity-60 transition-opacity pb-px"
          >
            VIEW ALL (450 ITEMS)
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#E8E6E1] animate-pulse rounded-xl" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : (
          <ProductCarousel products={bestSellingProducts} apiProducts={rawAPIProducts} slidesToShow={4} />
        )}
      </div>
    </section>
  );
};
