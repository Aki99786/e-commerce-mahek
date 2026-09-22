"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { productService } from "@/features/products/services/product.service";
import { adaptAPIProductToUI } from "@/features/products/utils/product-adapter";
import { ROUTES } from "@/constants/routes";
import { CategorySlugEnum } from "@/constants/categories";
import type { Product as APIProduct } from "@/features/products/types";

interface TrendingWithBannerSectionProps {
  bannerPosition?: "left" | "right";
  title?: string;
  type?: string;
  viewAllLink?: string;
}

enum ProductType {
  TRENDING = "TRENDING",
  LEHENGA = "LEHENGA",
}

export const TrendingWithBannerSection = ({
  title = "Top Trending Collection",
  type = "",
  viewAllLink,
}: TrendingWithBannerSectionProps) => {
  const [trendingProducts, setTrendingProducts] = useState<import("@/types/product").Product[]>([]);
  const [rawAPIProducts, setRawAPIProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const viewAllHref = viewAllLink
    ? viewAllLink
    : type === ProductType.LEHENGA
      ? ROUTES.CATEGORY(CategorySlugEnum.LEHENGA)
      : type === ProductType.TRENDING
        ? ROUTES.TRENDING
        : ROUTES.SHOP;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await productService.getTrendingProducts(4);
        const mappedProducts = response.products.slice(0, 4).map(adaptAPIProductToUI);
        setTrendingProducts(mappedProducts);
        setRawAPIProducts(response.products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch trending products:", error);
        setTrendingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLehenga = async () => {
      try {
        const response = await productService.getProductsList({
          category: CategorySlugEnum.LEHENGA,
          limit: 4,
          page: 1,
        });
        const mappedProducts = response.products.slice(0, 4).map(adaptAPIProductToUI);
        setTrendingProducts(mappedProducts);
        setRawAPIProducts(response.products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch lehenga products:", error);
        setTrendingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (type === ProductType.TRENDING) {
      fetchTrending();
    } else if (type === ProductType.LEHENGA) {
      fetchLehenga();
    }
  }, [type]);

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and View All */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-rose-600 mb-1.5">
              New Arrivals
            </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors whitespace-nowrap"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 4 Cards Grid - Responsive & Adjusted */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {isLoading ? (
            // Loading Skeletons for 4 cards
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl"
              />
            ))
          ) : (
            trendingProducts.map((product) => {
              const rawProduct = rawAPIProducts.find((p) => p._id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  apiProduct={rawProduct}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
