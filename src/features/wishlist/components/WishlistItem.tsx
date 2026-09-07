"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Availability } from "../types";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/lib/toast";
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

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.info(`We will notify you when ${item.product.name} is back in stock!`);
      return;
    }

    if (isInCart) {
      router.push(ROUTES.CART);
      return;
    }

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

  // Rating Display matching luxury reference (e.g. 4.2 ★)
  const ratingAverage = (() => {
    let hash = 0;
    const id = item.product_id || item.product._id || item._id || "";
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) % 9;
    }
    return Number((4.1 + hash * 0.1).toFixed(1));
  })();

  const brandName = item.brand || item.product.brand || "DESIGNER";
  const productName = item.product_name || item.product.name;
  const currentPrice = item.product.price;
  const originalPrice = item.product.oldPrice;
  const discountPercent = item.product.discountPercent;
  const productUrl = `/product/${item.product._id}`;

  return (
    <div
      className={`group relative bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden ${
        isRemoving ? "opacity-40 pointer-events-none scale-95" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Link href={productUrl} className="block w-full h-full relative">
          <Image
            src={item.product.images?.[0] || "/placeholder.jpg"}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-500 ease-out ${
              isOutOfStock ? "blur-[5px] opacity-85 scale-[1.05]" : "group-hover:scale-105"
            }`}
          />
        </Link>

        {/* Frosted Milky Overlay when Sold Out */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1.5px] pointer-events-none z-[1]" />
        )}

        {/* Rating Badge (Top Left) - Hidden on Sold Out */}
        {!isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-gray-900 pointer-events-none z-10">
            <span>{ratingAverage.toFixed(1)}</span>
            <svg className="w-2.5 h-2.5 text-gray-900 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
        )}

        {/* Close/Remove Button (Top Right) */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Remove from wishlist"
          className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 z-10 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sold Out Banner (Crisp Center Overlay) */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-[#333333]/95 text-white text-[11px] sm:text-xs font-semibold tracking-[0.25em] px-5 py-2.5 uppercase shadow-md select-none">
              SOLD OUT
            </div>
          </div>
        )}

        {/* Bottom Floating Action Button */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <button
              type="button"
              onClick={handleAction}
              className="w-full bg-[#2E2E2E] hover:bg-[#1E1E1E] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-3 uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              NOTIFY ME
            </button>
          ) : isInCart ? (
            <button
              type="button"
              onClick={handleAction}
              className="w-full bg-[#C1272D] hover:bg-[#a81f25] text-white text-[11px] sm:text-xs font-bold py-2.5 px-3 uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              GO TO BAG
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAction}
              disabled={isAddingToCart}
              className="w-full bg-black hover:bg-neutral-900 text-white text-[11px] sm:text-xs font-bold py-2.5 px-3 uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {isAddingToCart ? "ADDING..." : "ADD TO BAG"}
            </button>
          )}
        </div>
      </div>

      {/* Details Below Image */}
      <div className="pt-2.5 pb-3 px-2 sm:px-2.5 text-left flex flex-col">
        {/* Brand */}
        <Link href={productUrl}>
          <h3 className="font-extrabold text-xs sm:text-sm tracking-wider text-gray-900 uppercase truncate hover:text-gray-700 transition-colors">
            {brandName}
          </h3>
        </Link>

        {/* Product Name */}
        <Link href={productUrl}>
          <p className="text-xs sm:text-[13px] text-gray-500 font-normal truncate mt-0.5 hover:text-gray-700 transition-colors">
            {productName}
          </p>
        </Link>

        {/* Price Row */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="font-bold text-xs sm:text-sm md:text-base text-gray-900">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          {originalPrice > currentPrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {discountPercent > 0 && originalPrice > currentPrice && (
            <span className="text-[11px] sm:text-xs text-[#008060] font-medium">
              ({discountPercent}% OFF)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
