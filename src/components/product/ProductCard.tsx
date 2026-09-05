"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductLabelType, StockStatus } from "@/types/product";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { cartService } from "@/features/cart/services/cart.service";
import { isAuthenticated } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { toast } from "@/lib/toast";
import type { ProductVariantSize } from "@/features/products/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "default" | "compact";
  apiProduct?: import("@/features/products/types").Product;
  initialWishlistState?: boolean;
  onWishlistChange?: () => void | Promise<void>;
}

export const ProductCard = ({
  product,
  className,
  variant = "default",
  apiProduct,
  initialWishlistState = false,
  onWishlistChange,
}: ProductCardProps) => {
  const router = useRouter();
  const productUrl = ROUTES.PRODUCT_DETAIL(product.id);
  void variant;

  const {
    incrementCartCount,
    incrementWishlistCount,
    decrementWishlistCount,
    wishlistedProductIds,
    cartedProductIds,
    addToWishlistedIds,
    removeFromWishlistedIds,
    addToCartedIds,
    getWishlistItemId,
    refreshCounts,
  } = useCartWishlist();

  const [isInWishlist, setIsInWishlist] = useState(
    () => wishlistedProductIds.has(product.id) || initialWishlistState
  );
  const [isInCart, setIsInCart] = useState(() =>
    cartedProductIds.has(product.id)
  );
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState<"like" | "unlike" | null>(
    null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsInWishlist(wishlistedProductIds.has(product.id) || initialWishlistState);
  }, [wishlistedProductIds, product.id, initialWishlistState]);

  useEffect(() => {
    setIsInCart(cartedProductIds.has(product.id));
  }, [cartedProductIds, product.id]);

  // Resolve Images
  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : (apiProduct?.variant?.images || []).map((url) => ({
          url,
          alt: product.name,
        }));

  // Hover cycling through multiple images
  useEffect(() => {
    if (isHovering && displayImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 1400); // Slower, comfortable viewing pace
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, displayImages.length]);

  // Handle Wishlist Toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const currentVariant =
      (apiProduct as unknown as { selectedVariant?: import("@/features/products/types").ProductVariant })?.selectedVariant ||
      apiProduct?.variant;

    if (!currentVariant) {
      router.push(productUrl);
      return;
    }

    setHeartAnimation(isInWishlist ? "unlike" : "like");
    setTimeout(() => setHeartAnimation(null), 400);
    setIsAddingToWishlist(true);

    try {
      const validSizes = (currentVariant.sizes || []).filter(
        (s: ProductVariantSize | null | undefined): s is ProductVariantSize =>
          s !== null && s !== undefined && !!s.size
      );
      const firstSize = validSizes.length > 0 ? validSizes[0].size : "ONE_SIZE";
      const firstSizeId = validSizes.length > 0 ? validSizes[0]._id : undefined;

      if (isInWishlist) {
        const wishlistItemId = getWishlistItemId(product.id);
        if (wishlistItemId) {
          await wishlistService.removeFromWishlist(wishlistItemId);
        }
        setIsInWishlist(false);
        decrementWishlistCount();
        removeFromWishlistedIds(product.id);
      } else {
        await wishlistService.addToWishlist({
          productId: product.id,
          variantId: currentVariant._id,
          size_id: firstSizeId,
          size: firstSize,
        });
        setIsInWishlist(true);
        incrementWishlistCount();
        addToWishlistedIds(product.id);
        await refreshCounts();
      }

      if (onWishlistChange) {
        await onWishlistChange();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const currentVariant =
      (apiProduct as unknown as { selectedVariant?: import("@/features/products/types").ProductVariant })?.selectedVariant ||
      apiProduct?.variant;

    if (!currentVariant) {
      router.push(productUrl);
      return;
    }

    setIsAddingToCart(true);
    try {
      const validSizes = (currentVariant.sizes || []).filter(
        (s: ProductVariantSize | null | undefined): s is ProductVariantSize =>
          s !== null && s !== undefined && !!s.size
      );
      const firstSize = validSizes.length > 0 ? validSizes[0].size : "ONE_SIZE";
      const firstSizeId = validSizes.length > 0 ? validSizes[0]._id : undefined;

      await cartService.addToCart({
        productId: product.id,
        variantId: currentVariant._id,
        size: firstSize,
        size_id: firstSizeId,
        quantity: 1,
      });
      setIsInCart(true);
      incrementCartCount();
      addToCartedIds(product.id);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Resolve Brand, Prices & Discount
  const brandName = product.brand || apiProduct?.brand || "Brand";

  const currentPrice =
    product.price?.current ??
    apiProduct?.variant?.sizes?.[0]?.selling_price;

  const originalPrice =
    product.price?.original ??
    (apiProduct?.variant?.sizes?.[0]?.mrp &&
    apiProduct.variant.sizes[0].mrp > (currentPrice || 0)
      ? apiProduct.variant.sizes[0].mrp
      : undefined);

  const discount =
    product.price?.discount ??
    (originalPrice && currentPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : undefined);

  // Statuses
  const isSoldOut =
    product.stockStatus === StockStatus.OUT_OF_STOCK ||
    product.label?.type === ProductLabelType.SOLD_OUT ||
    (product.sizes &&
      product.sizes.length > 0 &&
      product.sizes.every((s) => !s.available));

  const hasDiscount = Boolean(
    (originalPrice && currentPrice && originalPrice > currentPrice) ||
      product.label?.type === ProductLabelType.SALE ||
      (apiProduct as unknown as { is_sale?: boolean })?.is_sale
  );

  const isNew = product.label?.type === ProductLabelType.NEW;

  // Rating Display
  const ratingAverage =
    product.rating?.average && product.rating.average > 0
      ? product.rating.average
      : (() => {
          let hash = 0;
          for (let i = 0; i < (product.id || "").length; i++) {
            hash = (hash * 31 + (product.id || "").charCodeAt(i)) % 9;
          }
          return Number((4.1 + hash * 0.1).toFixed(1));
        })();

  const ratingCount =
    product.rating?.count && product.rating.count > 0
      ? product.rating.count
      : undefined;

  // Bottom Button Action
  const handleBottomAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) {
      toast.info(`We will notify you when ${product.name} is back in stock!`);
      return;
    }

    if (isInCart) {
      router.push(ROUTES.CART);
      return;
    }

    handleAddToCart(e);
  };

  return (
    <div
      className={cn(
        "group relative w-full bg-white flex flex-col rounded-lg overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <style>{`
        @keyframes heart-like {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.35); }
          60%  { transform: scale(0.9); }
          80%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes heart-unlike {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.75); }
          100% { transform: scale(1); }
        }
        .heart-anim-like  { animation: heart-like 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .heart-anim-unlike { animation: heart-unlike 0.35s ease forwards; }
      `}</style>

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Link href={productUrl} className="block w-full h-full relative">
          {displayImages.length > 0 ? (
            displayImages.map((img, idx) => (
              <Image
                key={img.url + idx}
                src={img.url}
                alt={img.alt || product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={cn(
                  "object-cover object-center transition-opacity duration-700 ease-in-out",
                  idx === currentImageIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
                )}
                priority={idx === 0}
              />
            ))
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </Link>

        {/* Multiple Image Indicator Dots (on Hover) */}
        {displayImages.length > 1 && isHovering && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 z-20 pointer-events-none transition-opacity duration-200">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentImageIndex
                    ? "bg-[#C1272D] w-3"
                    : "bg-white/80 w-1.5 shadow-sm"
                )}
              />
            ))}
          </div>
        )}

        {/* Top-Left Badges: Rating and Sale / New */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {/* Rating Badge */}
          <div className="bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 sm:px-2 sm:py-0.5 shadow-sm flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-900">
            <span>{ratingAverage.toFixed(1)}</span>
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-900 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            {ratingCount ? (
              <span className="text-gray-400 font-normal">| {ratingCount}</span>
            ) : null}
          </div>

          {/* Sale Badge */}
          {hasDiscount && (
            <span className="bg-[#C1272D] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm shadow-sm">
              SALE
            </span>
          )}

          {/* New Badge */}
          {!hasDiscount && isNew && (
            <span className="bg-[#111111] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isAddingToWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-20 group/heart disabled:opacity-50"
        >
          <svg
            className={cn(
              "w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors duration-200",
              heartAnimation === "like"
                ? "heart-anim-like"
                : heartAnimation === "unlike"
                ? "heart-anim-unlike"
                : "",
              isInWishlist
                ? "text-red-500 fill-red-500"
                : "text-gray-700 group-hover/heart:text-red-500 stroke-[1.8]"
            )}
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Center Sold Out Banner */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-black/75 backdrop-blur-[2px] text-white text-xs sm:text-sm font-medium tracking-[0.25em] px-6 py-2.5 uppercase shadow-md">
              SOLD OUT
            </div>
          </div>
        )}

        {/* Bottom Hover Slide-up Button */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-20 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {isSoldOut ? (
            <button
              type="button"
              onClick={handleBottomAction}
              className="w-full bg-[#262626]/95 hover:bg-black text-white text-xs font-semibold py-2.5 px-3 tracking-wider flex items-center justify-center gap-2 uppercase shadow-md transition-all rounded-md sm:rounded-sm"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              NOTIFY ME
            </button>
          ) : isInCart ? (
            <button
              type="button"
              onClick={handleBottomAction}
              className="w-full bg-[#C1272D] hover:bg-[#a81f25] text-white text-xs font-semibold py-2.5 px-3 tracking-wider flex items-center justify-center gap-2 uppercase shadow-md transition-all rounded-md sm:rounded-sm"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              GO TO BAG
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBottomAction}
              disabled={isAddingToCart}
              className="w-full bg-black/95 hover:bg-black text-white text-xs font-semibold py-2.5 px-3 tracking-wider flex items-center justify-center gap-2 uppercase shadow-md transition-all rounded-md sm:rounded-sm disabled:opacity-60"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {isAddingToCart ? "ADDING..." : "ADD TO BAG"}
            </button>
          )}
        </div>
      </div>

      {/* Product Details Below Image */}
      <div className="pt-2.5 pb-3 px-2 sm:px-2.5 text-left">
        {/* Brand */}
        <Link href={productUrl}>
          <h3 className="font-extrabold text-xs sm:text-sm tracking-wide text-gray-900 uppercase truncate hover:text-gray-700 transition-colors">
            {brandName}
          </h3>
        </Link>

        {/* Product Name / Subtitle */}
        <Link href={productUrl}>
          <p className="text-xs sm:text-[13px] text-gray-500 font-normal truncate mt-0.5 hover:text-gray-700 transition-colors">
            {product.name}
          </p>
        </Link>

        {/* Price Row: Rs. 999 Rs. 1,499 (33% OFF) */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          {currentPrice !== undefined ? (
            <>
              <span className="font-bold text-xs sm:text-sm md:text-base text-gray-900">
                Rs. {currentPrice.toLocaleString("en-IN")}
              </span>
              {originalPrice && originalPrice > currentPrice && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  Rs. {originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discount && discount > 0 && originalPrice && originalPrice > currentPrice && (
                <span className="text-[11px] sm:text-xs text-[#008060] font-medium">
                  ({discount}% OFF)
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-500">Price not available</span>
          )}
        </div>
      </div>
    </div>
  );
};
