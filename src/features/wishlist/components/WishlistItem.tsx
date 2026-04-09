"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { UIWishlistItem } from "../adapters/wishlist.adapter";

interface WishlistItemProps {
  item: UIWishlistItem;
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export function WishlistItem({ item, onRemove, onAddToCart }: WishlistItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.product._id);
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

  const isOutOfStock = item.product.availability === "OUT_OF_STOCK";

  return (
    <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow group">
      {/* Thumbnail */}
      <Link href={`/product/${item.product._id}`} className="flex-shrink-0">
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-md overflow-hidden bg-gray-50">
          {item.product.discountPercent > 0 && (
            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1 py-0.5 rounded font-poppins z-10 leading-none">
              -{item.product.discountPercent}%
            </span>
          )}
          <Image
            src={item.product.images?.[0] || "/placeholder.jpg"}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.product._id}`} className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 font-poppins hover:text-primary transition-colors line-clamp-2 leading-snug">
              {item.product.name}
            </h3>
          </Link>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors disabled:opacity-50 cursor-pointer mt-0.5"
            aria-label="Remove from wishlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-400 font-poppins mt-0.5 capitalize">
          {item.product.selectedColor}
          {item.size && item.size !== "ONE_SIZE" && <> · {item.size}</>}
        </p>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-sm font-bold text-gray-900 font-poppins">
            ₹{item.product.price.toLocaleString()}
          </span>
          {item.product.oldPrice > item.product.price && (
            <>
              <span className="text-xs text-gray-400 line-through font-poppins">
                ₹{item.product.oldPrice.toLocaleString()}
              </span>
              <span className="text-xs text-red-500 font-semibold font-poppins">
                {item.product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {isOutOfStock && (
          <p className="text-xs text-red-500 font-poppins mt-1">Out of Stock</p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          className="mt-3 px-4 py-1.5 border border-gray-800 text-gray-800 text-xs font-semibold font-poppins rounded hover:bg-gray-800 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAddingToCart ? "Moving..." : "Move to Bag"}
        </button>
      </div>
    </div>
  );
}
