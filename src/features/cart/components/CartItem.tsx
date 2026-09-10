"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Bookmark } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { UICartItem } from "../adapters/cart.adapter";

interface CartItemProps {
  item: UICartItem;
  isSelected?: boolean;
  onToggleSelect?: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onMoveToWishlist?: (cartItemId: string) => void;
}

export function CartItem({
  item,
  isSelected = true,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const productUrl = item.productId ? ROUTES.PRODUCT_DETAIL(item.productId) : "#";
  const productName = item.productName || item.product?.name || "Product";
  const productImage = item.images?.[0] || "/placeholder.jpg";
  const brandName = item.brand || "";
  const sellerName = (item as unknown as { seller?: string })?.seller || "";

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || !item?._id) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item._id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!item?._id) return;
    setIsRemoving(true);
    try {
      await onRemove(item._id);
    } finally {
      setIsRemoving(false);
    }
  };

  const itemPrice = item.price;
  const itemMrp = item.mrp && item.mrp > itemPrice ? item.mrp : itemPrice;
  const subtotalPrice = itemPrice * item.quantity;
  const subtotalMrp = itemMrp * item.quantity;
  const discountTotal = subtotalMrp - subtotalPrice;
  const discountPercent =
    itemMrp > itemPrice ? Math.round(((itemMrp - itemPrice) / itemMrp) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all p-3.5 sm:p-5 relative ${isRemoving ? "opacity-40 pointer-events-none" : ""
        }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Selection Checkbox */}
        <div className="pt-1 sm:pt-1.5 shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect?.(item._id)}
            className="w-4 h-4 rounded text-[#C1272D] focus:ring-[#C1272D] accent-[#C1272D] cursor-pointer"
          />
        </div>

        {/* Product Image */}
        <Link href={productUrl} className="shrink-0">
          <div className="relative w-22 h-28 sm:w-28 sm:h-36 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <Image
              src={productImage}
              alt={productName}
              fill
              sizes="(max-width: 640px) 88px, 112px"
              className="object-cover object-top hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0 pr-6 sm:pr-8">
          {/* Top Row: Brand & Remove button */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <Link href={productUrl}>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#C1272D] transition-colors leading-snug truncate">
                  {brandName}
                </h3>
              </Link>
              <Link href={productUrl}>
                <p className="text-xs sm:text-sm text-gray-600 font-normal line-clamp-1 mt-0.5 hover:text-gray-900 transition-colors">
                  {productName}
                </p>
              </Link>
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold tracking-wider uppercase mt-1">
                SOLD BY: {sellerName}
              </p>
            </div>

            {/* Action Buttons: Move to Wishlist & Remove */}
            <div className="absolute top-3.5 right-3.5 sm:top-4.5 sm:right-4.5 flex items-center gap-1">
              {onMoveToWishlist && (
                <button
                  type="button"
                  onClick={() => onMoveToWishlist(item._id)}
                  className="p-1 text-gray-400 hover:text-[#ff3e6c] transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                  title="Move to wishlist"
                  aria-label="Move to wishlist"
                >
                  <Bookmark className="w-4 h-4 stroke-[2]" />
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                title="Remove item"
                aria-label="Remove item"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Size & Quantity Row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Size pill */}
            <div className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-800 border border-gray-200/60 flex items-center gap-1 select-none">
              <span>Size: {item.size || "Free Size"}</span>
            </div>

            {/* Quantity Stepper (from user screenshot 2!) */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-medium cursor-pointer select-none"
              >
                −
              </button>
              <span className="w-8 h-7 sm:h-8 flex items-center justify-center border-x border-gray-200 font-bold text-xs sm:text-sm text-gray-900 select-none">
                {isUpdating ? (
                  <svg className="w-3 h-3 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  item.quantity
                )}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-medium cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Line (No info icon, No delivery date) */}
          <div className="mt-3 flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{subtotalPrice.toLocaleString("en-IN")}
            </span>
            {discountTotal > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through font-normal">
                  ₹{subtotalMrp.toLocaleString("en-IN")}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#C1272D]">
                  -₹{discountTotal.toLocaleString("en-IN")} OFF ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
