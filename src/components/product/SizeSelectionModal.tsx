"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";

export interface SizeOption {
  _id?: string;
  size: string;
  quantity?: number;
  selling_price?: number;
  mrp?: number;
}

export interface SizeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  brand?: string;
  seller?: string;
  image?: string;
  sizes: SizeOption[];
  defaultPrice?: number;
  defaultMrp?: number;
  onConfirm: (selectedSize: SizeOption) => Promise<void>;
}

export function formatSizeLabel(rawSize: string): string {
  if (!rawSize) return "Onesize";
  const upper = rawSize.trim().toUpperCase();
  if (upper === "ONE_SIZE" || upper === "ONESIZE" || upper === "ONE SIZE") {
    return "Onesize";
  }
  if (upper === "FREE_SIZE" || upper === "FREESIZE" || upper === "FREE SIZE") {
    return "Free Size";
  }
  return rawSize;
}

export function SizeSelectionModal({
  isOpen,
  onClose,
  productName,
  brand,
  seller,
  image,
  sizes,
  defaultPrice,
  defaultMrp,
  onConfirm,
}: SizeSelectionModalProps) {
  // Normalize sizes list (ensure at least one size exists)
  const normalizedSizes = useMemo<SizeOption[]>(() => {
    if (!sizes || sizes.length === 0) {
      return [
        {
          _id: undefined,
          size: "ONE_SIZE",
          quantity: 1,
          selling_price: defaultPrice,
          mrp: defaultMrp,
        },
      ];
    }
    return sizes;
  }, [sizes, defaultPrice, defaultMrp]);

  // Find first available in-stock size or first size
  const firstAvailableIndex = useMemo(() => {
    const idx = normalizedSizes.findIndex((s) => (s.quantity ?? 1) > 0);
    return idx !== -1 ? idx : 0;
  }, [normalizedSizes]);

  const [selectedIndex, setSelectedIndex] = useState<number>(firstAvailableIndex);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selected index when modal opens or sizes change
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(firstAvailableIndex);
      setIsSubmitting(false);
    }
  }, [isOpen, firstAvailableIndex]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSelectedSize = normalizedSizes[selectedIndex] || normalizedSizes[0];

  // Dynamic price calculation
  const currentPrice =
    currentSelectedSize?.selling_price !== undefined
      ? currentSelectedSize.selling_price
      : defaultPrice ?? 0;

  const currentMrp =
    currentSelectedSize?.mrp !== undefined
      ? currentSelectedSize.mrp
      : defaultMrp;

  const discountPercent =
    currentMrp && currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : 0;

  const displaySeller = seller || brand || "Vision Star";

  const handleDone = async () => {
    if (!currentSelectedSize) return;
    setIsSubmitting(true);
    try {
      await onConfirm(currentSelectedSize);
      onClose();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-size-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] bg-white rounded-lg shadow-2xl p-4 sm:p-5 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Top Product Info Row */}
        <div className="flex items-start gap-3.5 pr-8">
          {/* Thumbnail */}
          <div className="relative w-[64px] h-[80px] sm:w-[70px] sm:h-[88px] shrink-0 bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
            {image ? (
              <Image
                src={image}
                alt={productName}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}
          </div>

          {/* Product Title and Price */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h2
              id="select-size-title"
              className="text-sm sm:text-[15px] font-normal text-gray-800 line-clamp-2 leading-snug"
              title={productName}
            >
              {productName}
            </h2>

            {/* Price Line */}
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ₹ {currentPrice.toLocaleString("en-IN")}
              </span>
              {currentMrp !== undefined && currentMrp > currentPrice && currentMrp > 0 ? (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ₹ {currentMrp.toLocaleString("en-IN")}
                </span>
              ) : null}
              {discountPercent > 0 && currentMrp !== undefined && currentMrp > currentPrice && currentMrp > 0 ? (
                <span className="text-xs sm:text-sm font-bold text-[#ff6f61]">
                  ({discountPercent}% OFF)
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200/90 my-4" />

        {/* Select Size Section */}
        <div className="mb-4">
          <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-3">
            Select Size
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {normalizedSizes.map((sizeOption, idx) => {
              const formatted = formatSizeLabel(sizeOption.size);
              const isPill = formatted.length > 3; // "Onesize", "Free Size" are rendered as pills
              const isSelected = selectedIndex === idx;
              const isOutOfStock = (sizeOption.quantity ?? 1) <= 0;

              return (
                <button
                  key={sizeOption._id || `${sizeOption.size}-${idx}`}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative transition-all duration-150 flex items-center justify-center select-none cursor-pointer bg-white ${
                    isPill
                      ? "px-5 py-2 min-h-[42px] rounded-full text-sm font-bold"
                      : "w-11 h-11 sm:w-12 sm:h-12 rounded-full text-xs sm:text-sm font-bold"
                  } ${
                    isSelected
                      ? "border-[1.5px] border-[#ff3f6c] text-[#ff3f6c]"
                      : isOutOfStock
                      ? "border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                      : "border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <span>{formatted}</span>
                  {isOutOfStock && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-4/5 h-[1.5px] bg-gray-300 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-4 mb-5 text-sm sm:text-[15px] text-gray-900">
          <span className="font-normal text-gray-700">Seller: </span>
          <span className="font-bold text-gray-900">{displaySeller}</span>
        </div>

        {/* Bottom Done Action Button */}
        <button
          type="button"
          onClick={handleDone}
          disabled={isSubmitting || ((currentSelectedSize?.quantity ?? 1) <= 0)}
          className="w-full bg-[#ff3f6c] hover:bg-[#e0345d] active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 rounded-md text-sm sm:text-base tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Done...</span>
            </>
          ) : (
            <span>Done</span>
          )}
        </button>
      </div>
    </div>
  );
}
