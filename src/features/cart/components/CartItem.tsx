"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import { ROUTES } from "@/constants/routes";
import type { CartItem as CartItemType } from "../services/cart.service";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (variantId: string, size: string, quantity: number) => void;
  onRemove: (variantId: string, size: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const productUrl = ROUTES.CATEGORY(item.product._id);
  const productImage = item.images?.[0] || item.product.allImages?.[0] || "/placeholder.jpg";

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.variantId, item.size, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.variantId, item.size);
    } finally {
      setIsRemoving(false);
    }
  };

  const subtotal = item.price * item.quantity;
  const colorName = item.color.charAt(0).toUpperCase() + item.color.slice(1);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-opacity ${isRemoving ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">

        {/* Product Image */}
        <Link href={productUrl} className="flex-shrink-0">
          <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={productImage}
              alt={item.product.name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover object-top"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Name + remove button row */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link href={productUrl} className="flex-1 min-w-0">
                <h3
                  className="font-playfair font-semibold text-sm sm:text-base text-gray-900 hover:text-rose-700 transition-colors line-clamp-2 leading-snug"
                  data-tooltip-id={`product-name-${item.variantId}-${item.size}`}
                  data-tooltip-content={item.product.name}
                >
                  {item.product.name}
                </h3>
              </Link>
              <Tooltip
                id={`product-name-${item.variantId}-${item.size}`}
                place="top"
                className="!bg-gray-900 !text-white !text-xs !px-2 !py-1.5 !rounded !z-50"
              />
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                aria-label="Remove item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Color + Size pills */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-poppins text-gray-600">
                {colorName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-poppins text-gray-600">
                Size: {item.size}
              </span>
            </div>
          </div>

          {/* Price row + stepper */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Quantity stepper */}
            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
              >
                −
              </button>
              <span className="w-8 h-8 flex items-center justify-center border-x border-gray-200 font-poppins font-semibold text-sm text-gray-900">
                {isUpdating ? (
                  <svg className="w-3 h-3 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-base sm:text-lg font-bold font-poppins text-gray-900">
                ₹{subtotal.toLocaleString()}
              </p>
              {item.quantity > 1 && (
                <p className="text-[11px] text-gray-400 font-poppins">
                  ₹{item.price.toLocaleString()} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
