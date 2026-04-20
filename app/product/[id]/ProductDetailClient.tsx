"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/features/products/types";
import { cartService } from "@/features/cart/services/cart.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { isAuthenticated } from "@/lib/auth-utils";
import { ROUTES } from "@/constants/routes";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const { incrementCartCount, incrementWishlistCount, decrementWishlistCount, refreshCounts, cartedProductIds, addToCartedIds, wishlistedProductIds, addToWishlistedIds, removeFromWishlistedIds } = useCartWishlist();
  const [isInCart, setIsInCart] = useState(() => cartedProductIds.has(product._id));
  const [isInWishlist, setIsInWishlist] = useState(() => wishlistedProductIds.has(product._id));

  const selectedVariant = product.variants[selectedVariantIndex];
  const validSizes = selectedVariant.sizes.filter(s => s !== null && s !== undefined);
  const selectedSize = validSizes[selectedSizeIndex] || validSizes[0];
  const images = selectedVariant.images.length > 0 ? selectedVariant.images : product.allImages;
  const hasValidSizes = validSizes.length > 0;

  const discount = selectedVariant.mrp > 0 
    ? Math.round(((selectedVariant.mrp - selectedVariant.sellingPrice) / selectedVariant.mrp) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (isInCart) {
      router.push(ROUTES.CART);
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        productId: product._id,
        variantId: selectedVariant.variantId,
        size: hasValidSizes ? (selectedSize?.size || "ONE_SIZE") : "ONE_SIZE",
        quantity: 1,
      });
      setIsInCart(true);
      addToCartedIds(product._id);
      incrementCartCount();
      await refreshCounts();
    } catch {
      // Error handled silently
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated()) {
      router.push(ROUTES.LOGIN);
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist({
          productId: product._id,
          variantId: selectedVariant.variantId,
          size: hasValidSizes ? (selectedSize?.size || "ONE_SIZE") : "ONE_SIZE",
        });
        setIsInWishlist(false);
        removeFromWishlistedIds(product._id);
        decrementWishlistCount();
      } else {
        await wishlistService.addToWishlist({
          productId: product._id,
          variantId: selectedVariant.variantId,
          size: hasValidSizes ? (selectedSize?.size || "ONE_SIZE") : "ONE_SIZE",
        });
        setIsInWishlist(true);
        addToWishlistedIds(product._id);
        incrementWishlistCount();
      }
      await refreshCounts();
    } catch {
      // Error handled silently
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">

            {/* Main Image */}
            <div className="flex-1 relative order-1">
              <div 
                ref={imageRef}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Zoom Lens Overlay */}
                {showZoom && (
                  <div 
                    className="absolute w-32 h-32 border-2 border-white shadow-lg pointer-events-none bg-white/20 z-99"
                    style={{
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-poppins">
                  {selectedImageIndex + 1}/{images.length}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleToggleWishlist}
                  disabled={isAddingToWishlist}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-6 h-6 transition-colors ${isInWishlist ? "fill-rose-500 text-rose-500" : "text-gray-800"}`} />
                </button>
              </div>
              
              {/* Zoomed Image Preview */}
              {showZoom && (
                <div className="absolute left-full ml-4 top-0 w-96 h-96 rounded-2xl overflow-hidden bg-white shadow-2xl border-2 border-gray-200 hidden lg:block z-50">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${images[selectedImageIndex]})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Strip — horizontal on mobile, vertical on lg+ */}
            <div className="order-2 flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-3 lg:overflow-x-visible lg:overflow-y-auto lg:w-20 lg:max-h-[600px] lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-auto ${
                    selectedImageIndex === index
                      ? "border-pink-600 ring-2 ring-pink-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 80px, 80px"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* Right Side - Product Info */}
          <div className="flex flex-col">
            {/* Brand */}
            <div className="mb-3">
              <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-poppins font-medium">
                {product.brand}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-3 sm:mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < Math.floor(product.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-poppins font-semibold text-gray-900 text-sm sm:text-base">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="font-poppins text-gray-500 text-sm sm:text-base">
                ({product.totalReviews} ratings)
              </span>
            </div>

            {/* Pricing */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900">
                  ₹{selectedVariant.sellingPrice.toLocaleString()}
                </span>
                {selectedVariant.mrp > selectedVariant.sellingPrice && (
                  <>
                    <span className="text-xl sm:text-2xl font-poppins text-gray-400 line-through">
                      ₹{selectedVariant.mrp.toLocaleString()}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-xs sm:text-sm font-poppins font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {selectedVariant.mrp > selectedVariant.sellingPrice && (
                <p className="text-green-600 font-poppins text-sm font-medium">
                  You save ₹{(selectedVariant.mrp - selectedVariant.sellingPrice).toLocaleString()}!
                </p>
              )}
              <p className="text-gray-500 font-poppins text-sm mt-1">
                inclusive of all taxes
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-poppins font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
                Select Color
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.variants.map((variant, index) => {
                  const isSelected = selectedVariantIndex === index;
                  const variantDiscount = variant.mrp > 0 
                    ? Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)
                    : 0;
                  
                  return (
                    <button
                      key={variant.variantId}
                      onClick={() => {
                        setSelectedVariantIndex(index);
                        setSelectedSizeIndex(0);
                        setSelectedImageIndex(0);
                      }}
                      className={`relative px-3 py-2 sm:px-5 sm:py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-pink-600 bg-pink-50 ring-2 ring-pink-200"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="text-left">
                        <p className={`font-poppins font-medium text-sm ${
                          isSelected ? "text-pink-700" : "text-gray-900"
                        }`}>
                          {variant.color}
                        </p>
                        <p className="font-poppins text-xs text-gray-600 mt-0.5">
                          ₹{variant.sellingPrice.toLocaleString()}
                          {variantDiscount > 0 && (
                            <span className="text-green-600 ml-1">
                              ({variantDiscount}% OFF)
                            </span>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            {hasValidSizes && (
              <div className="mb-6 sm:mb-8">
                <h3 className="font-poppins font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {validSizes.map((sizeOption, index) => {
                  const isSelected = selectedSizeIndex === index;
                  const isOutOfStock = sizeOption.stock === 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isOutOfStock && setSelectedSizeIndex(index)}
                      disabled={isOutOfStock}
                      className={`relative px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border-2 transition-all min-w-[64px] sm:min-w-[80px] ${
                        isOutOfStock
                          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-200"
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <span className="font-poppins font-medium text-sm">
                        {sizeOption.size}
                      </span>
                      {isOutOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-0.5 bg-gray-400 rotate-45"></span>
                        </span>
                      )}
                    </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart / Go to Bag Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isInCart && (hasValidSizes ? (!selectedSize || selectedSize.stock === 0 || isAddingToCart) : isAddingToCart)}
              className={`w-full font-poppins font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg mb-4 ${
                isInCart
                  ? "bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 shadow-pink-100 cursor-pointer"
                  : "bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-pink-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {isInCart
                ? "Go to Bag"
                : isAddingToCart
                ? "Adding..."
                : hasValidSizes
                ? (!selectedSize || selectedSize.stock === 0 ? "Out of Stock" : "Add to Bag")
                : "Add to Bag"}
            </button>

            {/* Product Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="font-poppins font-semibold text-gray-900 mb-3 sm:mb-4 uppercase text-sm tracking-wide">
                Product Details
              </h3>
              <div className="space-y-3">
                {product.description && (
                  <div 
                    className="font-poppins text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mt-4">
              <h3 className="font-poppins font-semibold text-gray-900 mb-3 sm:mb-4 uppercase text-sm tracking-wide">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Fabric
                  </p>
                  <p className="font-poppins text-sm text-gray-900 font-medium">
                    {product.fabric}
                  </p>
                </div>
                <div>
                  <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Pattern
                  </p>
                  <p className="font-poppins text-sm text-gray-900 font-medium">
                    {product.pattern}
                  </p>
                </div>
                {product.sleeveType && (
                  <div>
                    <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Sleeve Type
                    </p>
                    <p className="font-poppins text-sm text-gray-900 font-medium">
                      {product.sleeveType}
                    </p>
                  </div>
                )}
                {product.neckType && (
                  <div>
                    <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Neck Type
                    </p>
                    <p className="font-poppins text-sm text-gray-900 font-medium">
                      {product.neckType}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Total Stock
                  </p>
                  <p className="font-poppins text-sm text-gray-900 font-medium">
                    {hasValidSizes ? (selectedSize && selectedSize.stock > 0 ? `${selectedSize.stock} units` : "Out of Stock") : "One Size"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
