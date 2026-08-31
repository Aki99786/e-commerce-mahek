"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface StickyCartBarProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

export const StickyCartBar = ({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onQuantityChange,
  onAddToCart,
}: StickyCartBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg z-50 transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-3 md:px-8 lg:px-16 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <div className="relative w-12 h-14 md:w-16 md:h-20 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs md:text-sm font-semibold text-white truncate">
                {product.name}
              </h3>
              <p className="text-xs text-gray-300 truncate">
                {selectedColor} / {selectedSize} - ₹{(product.price.current ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="hidden md:flex items-center border border-gray-600 rounded-lg bg-gray-800">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-10 h-8 flex items-center justify-center text-sm text-white border-x border-gray-600">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <button
              onClick={onAddToCart}
              className="bg-primary text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
