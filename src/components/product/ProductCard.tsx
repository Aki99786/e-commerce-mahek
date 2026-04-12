"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import { Product, ProductLabelType } from "@/types/product";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { cartService } from "@/features/cart/services/cart.service";
import { isAuthenticated } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import type { ProductVariantSize } from "@/features/products/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
  apiProduct?: import('@/features/products/types').Product;
  initialWishlistState?: boolean;
  onWishlistChange?: () => void | Promise<void>;
}

export const ProductCard = ({ product, className, variant = 'default', apiProduct, initialWishlistState = false, onWishlistChange }: ProductCardProps) => {
  const router = useRouter();
  const productUrl = ROUTES.PRODUCT_DETAIL(product.id);
  void variant;
  const { incrementCartCount, incrementWishlistCount, decrementWishlistCount, wishlistedProductIds, cartedProductIds, addToWishlistedIds, removeFromWishlistedIds, addToCartedIds } = useCartWishlist();
  const [isInWishlist, setIsInWishlist] = useState(() => wishlistedProductIds.has(product.id) || initialWishlistState);
  const [isInCart, setIsInCart] = useState(() => cartedProductIds.has(product.id));
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState<"like" | "unlike" | null>(null);
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

  useEffect(() => {
    if (isHovering && product.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 500);
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
  }, [isHovering, product.images.length]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!apiProduct || !(apiProduct.variants as unknown[]) || (apiProduct.variants as unknown[]).length === 0) {
      router.push(productUrl);
      return;
    }

    setHeartAnimation(isInWishlist ? "unlike" : "like");
    setTimeout(() => setHeartAnimation(null), 400);
    setIsAddingToWishlist(true);
    try {
      // Use first variant and first available size (consistent for add & remove)
        const firstVariant = apiProduct.variants[0];
        const validSizes = (firstVariant.sizes || []).filter(
          (s: ProductVariantSize | null | undefined): s is ProductVariantSize =>
            s !== null && s !== undefined && !!s.size,
        );
        const firstSize = validSizes.length > 0 ? validSizes[0].size : "ONE_SIZE";

      if (isInWishlist) {
        await wishlistService.removeFromWishlist({
          productId: product.id,
          variantId: firstVariant.variantId,
          size: firstSize,
        });
        setIsInWishlist(false);
        decrementWishlistCount();
        removeFromWishlistedIds(product.id);
      } else {
        await wishlistService.addToWishlist({
          productId: product.id,
          variantId: firstVariant.variantId,
          size: firstSize,
        });
        setIsInWishlist(true);
        incrementWishlistCount();
        addToWishlistedIds(product.id);
      }
      
      // Notify parent component to refresh wishlist
      if (onWishlistChange) {
        await onWishlistChange();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // If no API product data, redirect to detail page
    if (!apiProduct || !apiProduct.variants || apiProduct.variants.length === 0) {
      router.push(productUrl);
      return;
    }

    setIsAddingToCart(true);
    try {
      // Use first variant and first available size
      const firstVariant = apiProduct.variants[0];
      
      // Filter out null/undefined sizes and get first valid size
      const validSizes = (firstVariant.sizes || []).filter(
        (s: ProductVariantSize | null | undefined): s is ProductVariantSize => s !== null && s !== undefined && !!s.size
      );
      const firstSize = validSizes.length > 0 
        ? validSizes[0].size 
        : "ONE_SIZE";
      
      await cartService.addToCart({
        productId: product.id,
        variantId: firstVariant.variantId,
        size: firstSize,
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

  return (
    <div className={cn("group w-full bg-white overflow-hidden transition-shadow rounded-lg sm:rounded-none", className)}>
      <div 
        className="relative overflow-hidden rounded-t-lg sm:rounded-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link href={productUrl}>
          <div className="relative aspect-[3/4] w-full bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[currentImageIndex].url}
                alt={product.images[currentImageIndex].alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-opacity duration-300"
                priority={currentImageIndex === 0}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
              </div>
            )}
          </div>
        </Link>

        {product.label?.type === ProductLabelType.NEW && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase font-poppins rounded-sm" style={{ backgroundColor: '#C1272D' }}>
            NEW
          </div>
        )}

        {product.label?.type === ProductLabelType.SALE && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 uppercase font-poppins rounded-sm" style={{ backgroundColor: '#C1272D' }}>
            SALE
          </div>
        )}

        {product.rating && product.rating.average > 0 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white rounded px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm flex items-center gap-0.5 sm:gap-1">
            <span className="text-[10px] sm:text-xs font-semibold font-poppins">{product.rating.average.toFixed(1)}</span>
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-[10px] sm:text-xs text-gray-400 font-poppins">| {product.rating.count}</span>
          </div>
        )}

        <style>{`
          @keyframes heart-like {
            0%   { transform: scale(1); }
            30%  { transform: scale(1.45); }
            60%  { transform: scale(0.9); }
            80%  { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes heart-unlike {
            0%   { transform: scale(1); }
            40%  { transform: scale(0.7); }
            100% { transform: scale(1); }
          }
          .heart-anim-like  { animation: heart-like  0.4s ease forwards; }
          .heart-anim-unlike { animation: heart-unlike 0.35s ease forwards; }
        `}</style>
        <button
          onClick={handleWishlistToggle}
          disabled={isAddingToWishlist}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200 cursor-pointer group/heart disabled:opacity-50"
        >
          <svg
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200",
              heartAnimation === "like" ? "heart-anim-like" : heartAnimation === "unlike" ? "heart-anim-unlike" : "",
              isInWishlist
                ? "text-red-500 fill-red-500"
                : "text-gray-700 group-hover/heart:text-red-500 group-hover/heart:fill-red-500"
            )}
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {product.images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-gray-300" : "bg-gray-300"
                )}
                style={index === currentImageIndex ? { backgroundColor: '#C1272D' } : {}}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={isInCart ? (e) => { e.preventDefault(); e.stopPropagation(); router.push(ROUTES.CART); } : handleAddToCart}
          disabled={isAddingToCart}
          className="w-full border rounded px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold font-poppins transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
          style={{
            borderColor: isInCart ? '#C1272D' : isAddingToCart ? '#C1272D' : undefined,
            color: isInCart ? '#ffffff' : isAddingToCart ? '#C1272D' : undefined,
            backgroundColor: isInCart ? '#C1272D' : undefined,
          }}
          onMouseEnter={(e) => {
            if (!isInCart) {
              e.currentTarget.style.borderColor = '#C1272D';
              e.currentTarget.style.color = '#C1272D';
            }
          }}
          onMouseLeave={(e) => {
            if (!isInCart && !isAddingToCart) {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.color = '';
            }
          }}
        >
          {isInCart ? (
            <>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              GO TO BAG
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isAddingToCart ? "ADDING..." : "ADD TO CART"}
            </>
          )}
        </button>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-600 font-poppins">
            Sizes: {product.sizes.slice(0, 3).map(s => s.name).join(", ")}{product.sizes.length > 3 ? "..." : ""}
          </div>
        )}

        <Link href={productUrl}>
          <h3 
            className="text-xs sm:text-sm font-medium text-gray-900 mt-2 sm:mt-3 mb-1 sm:mb-2 font-poppins hover:text-gray-700 transition-colors line-clamp-2 uppercase"
            data-tooltip-id={`product-card-${product.id}`}
            data-tooltip-content={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <Tooltip 
          id={`product-card-${product.id}`}
          place="top"
          className="!bg-gray-900 !text-white !text-xs sm:!text-sm !px-2 sm:!px-3 !py-1.5 sm:!py-2 !rounded !z-50"
        />

        <p 
          className="text-[10px] sm:text-xs text-gray-500 font-poppins line-clamp-1 mb-1.5 sm:mb-2"
          data-tooltip-id={`product-desc-${product.id}`}
          data-tooltip-content={product.shortDescription || product.category}
        >
          {product.shortDescription || product.category}
        </p>
        <Tooltip 
          id={`product-desc-${product.id}`}
          place="top"
          className="!bg-gray-900 !text-white !text-xs sm:!text-sm !px-2 sm:!px-3 !py-1.5 sm:!py-2 !rounded !z-50"
        />

        <div className="flex flex-col gap-0.5">
          {product.price?.current !== undefined ? (
            <>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-bold text-gray-900 font-poppins">
                  Rs. {product.price.current.toLocaleString()}
                </span>
                {product.price.original && product.price.original > product.price.current && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through font-poppins">
                    Rs. {product.price.original.toLocaleString()}
                  </span>
                )}
              </div>
              {product.price.original && product.price.original > product.price.current && (
                <span className="text-xs sm:text-sm text-orange-500 font-semibold font-poppins">
                  ({product.price.discount}% OFF)
                </span>
              )}
            </>
          ) : (
            <span className="text-xs sm:text-sm text-gray-500 font-poppins">Price not available</span>
          )}
        </div>
      </div>
    </div>
  );
};
