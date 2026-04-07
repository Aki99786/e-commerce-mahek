"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import type { Product as APIProduct } from "@/features/products/types";

interface ProductCarouselProps {
  products: Product[];
  apiProducts?: APIProduct[];
  slidesToShow?: number;
}

export const ProductCarousel = ({ products, apiProducts = [], slidesToShow = 5 }: ProductCarouselProps) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 160;
      if (window.innerWidth < 768) return 180;
      if (window.innerWidth < 1024) return 200;
      return 224;
    }
    return 224;
  };

  const slideLeft = () => {
    if (sliderIndex > 0) {
      setSliderIndex(sliderIndex - 1);
    }
  };

  const slideRight = () => {
    if (sliderIndex < products.length - slidesToShow) {
      setSliderIndex(sliderIndex + 1);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={slideLeft}
        disabled={sliderIndex === 0}
        className="hidden lg:flex absolute -left-[60px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer items-center justify-center"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={slideRight}
        disabled={sliderIndex >= products.length - slidesToShow}
        className="hidden lg:flex absolute -right-[60px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer items-center justify-center"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="overflow-x-auto lg:overflow-hidden scrollbar-hide">
        <div
          className="flex gap-3 md:gap-4 lg:gap-6 transition-all duration-500 lg:px-10"
          style={{ transform: `translateX(-${sliderIndex * getCardWidth()}px)` }}
        >
          {products.map((product) => {
            const rawProduct = apiProducts.find((p) => p._id === product.id);
            return (
              <div key={product.id} className="flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52">
                <ProductCard product={product} apiProduct={rawProduct} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
