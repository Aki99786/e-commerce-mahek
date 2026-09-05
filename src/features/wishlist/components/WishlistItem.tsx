"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Availability } from "../types";
import { ROUTES } from "@/constants/routes";
import type { UIWishlistItem } from "../adapters/wishlist.adapter";

interface WishlistItemProps {
  item: UIWishlistItem;
  onRemove: (wishlistItemId: string) => void;
  onAddToCart: (productId: string) => void;
  isInCart?: boolean;
}

export function WishlistItem({ item, onRemove, onAddToCart, isInCart = false }: WishlistItemProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemove = async () => {
    if (!item?._id) return;
    setIsRemoving(true);
    try {
      await onRemove(item._id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(item.product._id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = item.product.availability === Availability.OUT_OF_STOCK;

  return (
    <div className={`relative flex gap-3 sm:gap-4 bg-white rounded-xl border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-all duration-200 ${isRemoving ? "opacity-40 pointer-events-none" : ""}`}>

      {/* Thumbnail */}
      <Link href={`/product/${item.product._id}`} className="flex-shrink-0">
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50">
          {item.product.discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10 leading-none">
              -{item.product.discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <span className="text-[9px] font-bold text-red-500 bg-white/90 px-1.5 py-0.5 rounded">Out of Stock</span>
            </div>
          )}
          <Image
            src={item.product.images?.[0] || "/placeholder.jpg"}
            alt={item.product.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Name + remove */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Link href={`/product/${item.product._id}`} className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 hover:text-rose-700 transition-colors line-clamp-2 leading-snug">
                {item.product.name}
              </h3>
            </Link>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
              aria-label="Remove from wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Color + size pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.product.selectedColor && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[11px] text-gray-600 capitalize">
                {item.product.selectedColor}
              </span>
            )}
            {item.size && item.size !== "ONE_SIZE" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[11px] text-gray-600">
                Size: {item.size}
              </span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-base font-bold text-gray-900">
              ₹{item.product.price.toLocaleString()}
            </span>
            {item.product.oldPrice > item.product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{item.product.oldPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-rose-500 font-semibold">
                  {item.product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          <button
            onClick={isInCart ? () => router.push(ROUTES.CART) : handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isInCart
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isInCart ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Go to Bag
              </>
            ) : isAddingToCart ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Moving...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Move to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
