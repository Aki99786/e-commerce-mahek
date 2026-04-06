"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { productService } from "@/features/products/services/product.service";
import { ROUTES } from "@/constants/routes";

export const TrendingWithBannerSwappedSection = () => {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLehengas = async () => {
      try {
        const response = await productService.getLehengasProducts();
        const mappedProducts = response.products.slice(0, 4).map((p: any) => ({
          id: p._id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          shortDescription: p.category,
          images: p.allImages[0] ? [{ url: p.allImages[0], alt: p.name }] : [],
          price: {
            current: p.avgPrice,
            original: p.variants?.[0]?.mrp || p.avgPrice,
          },
          category: p.category,
          categorySlug: p.category.toLowerCase(),
          stockStatus: p.totalStock > 0 ? "in-stock" : "out-of-stock",
          rating: { average: p.averageRating, count: p.totalReviews },
          __apiProduct: p
        }));
        setTrendingProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch lehenga products:", error);
        setTrendingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLehengas();
  }, []);

  return (
    <section className="py-8 md:py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-playfair tracking-tight">Lehenga</h2>
              <Link href={ROUTES.TRENDING} className="text-xs md:text-sm font-medium text-gray-700 hover:text-black transition-colors font-poppins whitespace-nowrap">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {isLoading ? (
                // Loading Skeletons
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg" />
                ))
              ) : (
                trendingProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    variant="compact" 
                    apiProduct={product.__apiProduct}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 order-first lg:order-last">
            <div className="relative h-[280px] md:h-[300px] lg:h-full min-h-[420px] rounded-lg overflow-hidden">
              <Image
                src="/images/top-trandig-right-banner.png"
                alt="Modern Shehzadi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
