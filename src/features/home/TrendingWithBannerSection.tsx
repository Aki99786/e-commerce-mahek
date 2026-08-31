"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { productService } from "@/features/products/services/product.service";
import { adaptAPIProductToUI } from "@/features/products/utils/product-adapter";
import { ROUTES } from "@/constants/routes";
import type { Product as APIProduct } from "@/features/products/types";

interface TrendingWithBannerSectionProps {
  bannerPosition?: 'left' | 'right';
  title?: string;
  type?: string;
}

enum ProductType {
  TRENDING = 'TRENDING',
  LEHENGA = 'LEHENGA',
}

export const TrendingWithBannerSection = ({ bannerPosition = 'right', title = 'Top Trending Collection', type = '' }: TrendingWithBannerSectionProps) => {
  const [trendingProducts, setTrendingProducts] = useState<import('@/types/product').Product[]>([]);
  const [rawAPIProducts, setRawAPIProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await productService.getTrendingProducts();
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
        const response = await productService.getProductsList({ type: 'LEHENGA', limit: 4, page: 1 });
        const mappedProducts = response.products.map(adaptAPIProductToUI);
        setTrendingProducts(mappedProducts);
        setRawAPIProducts(response.products);
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
    <section className="py-8 md:py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 items-start ${bannerPosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className={bannerPosition === 'left' ? 'lg:col-span-2 order-first lg:order-last' : 'lg:col-span-2'}>
            <div className="relative h-[280px] md:h-[300px] lg:h-full min-h-[420px] rounded-lg overflow-hidden">
              <Image
                src={`/images/${bannerPosition === 'left' ? 'rightbgimg.png' : 'top-trandig-right-banner.png' }`}
                alt="Modern Shehzadi"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-end justify-between mb-4 md:mb-6">
              <div>
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-rose-600 mb-1.5">New Arrivals</p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
              </div>
              <Link href={ROUTES.SHOP} className="flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors whitespace-nowrap">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {isLoading ? (
                // Loading Skeletons
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg" />
                ))
              ) : (
                trendingProducts.map((product) => {
                  const rawProduct = rawAPIProducts.find((p) => p._id === product.id);
                  return (
                    <ProductCard 
                      key={product.id} 
                        product={product}
                      apiProduct={rawProduct}
                      variant="compact" 
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
