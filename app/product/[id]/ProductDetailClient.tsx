"use client";

import { useState, useRef, useEffect } from "react";
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
  const imageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomPreviewRef = useRef<HTMLDivElement>(null);
  const { incrementCartCount, incrementWishlistCount, decrementWishlistCount, refreshCounts, cartedProductIds, addToCartedIds, wishlistedProductIds, addToWishlistedIds, removeFromWishlistedIds, getWishlistItemId } = useCartWishlist();

  const variants =
    product.product_variants && product.product_variants.length > 0
      ? product.product_variants
      : product.variant
        ? [product.variant]
        : [];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  const validSizes = selectedVariant?.sizes?.filter((s) => s !== null && s !== undefined) || [];
  const selectedSize = validSizes[selectedSizeIndex] || validSizes[0];
  const images = selectedVariant?.images || [];
  const hasValidSizes = validSizes.length > 0;

  // Check is_wishlist from API (size/variant/product)
  const apiWishlist = Boolean(
    selectedSize?.is_wishlist ??
    selectedVariant?.sizes?.some((s) => s?.is_wishlist) ??
    (product as unknown as { is_wishlist?: boolean })?.is_wishlist
  );

  const [userWishlistState, setUserWishlistState] = useState<boolean | null>(null);

  const isInWishlist = userWishlistState !== null
    ? userWishlistState
    : (wishlistedProductIds.has(product._id) || apiWishlist);

  useEffect(() => {
    setUserWishlistState(null);
  }, [selectedSizeIndex, selectedVariantIndex, apiWishlist]);

  // Check is_cart_active from API (size/variant/product)
  const apiCartActive = Boolean(
    selectedSize?.is_cart_active ??
    selectedVariant?.sizes?.some((s) => s?.is_cart_active) ??
    (product as unknown as { is_cart_active?: boolean })?.is_cart_active
  );

  const [userCartState, setUserCartState] = useState<boolean | null>(null);

  const isInCart = userCartState !== null
    ? userCartState
    : (cartedProductIds.has(product._id) || apiCartActive);

  useEffect(() => {
    setUserCartState(null);
  }, [selectedSizeIndex, selectedVariantIndex, apiCartActive]);

  const sellingPrice = selectedSize ? selectedSize.selling_price : 0;
  const mrp = selectedSize ? selectedSize.mrp : 0;
  const discount =
    mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isInCart) {
      router.push(ROUTES.CART);
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        cartItems: [
          {
            productId: product._id,
            variantId: selectedVariant._id,
            size: hasValidSizes ? (selectedSize?.size || "ONE_SIZE") : "ONE_SIZE",
            size_id: selectedSize?._id,
            quantity: 1,
          },
        ],
      });
      setUserCartState(true);
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
      router.push(`/login?referrer=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        const wishlistItemId = getWishlistItemId(product._id);
        if (wishlistItemId) {
          await wishlistService.removeFromWishlist(wishlistItemId);
        }
        setUserWishlistState(false);
        removeFromWishlistedIds(product._id);
        decrementWishlistCount();
      } else {
        await wishlistService.addToWishlist({
          wishlistItems: [
            {
              productId: product._id,
              variantId: selectedVariant._id,
              size_id: selectedSize?._id,
              size: hasValidSizes ? (selectedSize?.size || "ONE_SIZE") : "ONE_SIZE",
            },
          ],
        });
        setUserWishlistState(true);
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

    if (lensRef.current) {
      lensRef.current.style.left = `${x}%`;
      lensRef.current.style.top = `${y}%`;
    }
    if (zoomPreviewRef.current) {
      zoomPreviewRef.current.style.backgroundPosition = `${x}% ${y}%`;
    }
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
                  alt={product.product_name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                
                {/* Sale Badge */}
                {product.is_sale && (
                  <span className="absolute top-4 left-4 bg-[#C1272D] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-md shadow-md z-10 pointer-events-none">
                    SALE
                  </span>
                )}
                
                {/* Zoom Lens Overlay */}
                {showZoom && (
                  <div 
                    ref={lensRef}
                    className="absolute w-32 h-32 border-2 border-white shadow-lg pointer-events-none bg-white/20 z-99"
                    style={{
                      left: "50%",
                      top: "50%",
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
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
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
                    ref={zoomPreviewRef}
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${images[selectedImageIndex]})`,
                      backgroundSize: '250%',
                      backgroundPosition: "50% 50%",
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
                    alt={`${product.product_name} thumbnail ${index + 1}`}
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
            {/* Brand & Sale Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                {product.brand}
              </span>
              {product.is_sale && (
                <span className="inline-block px-3 py-1 bg-[#C1272D] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  SALE
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {product.product_name}
            </h1>

            {/* Pricing */}
            <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₹{sellingPrice.toLocaleString()}
                </span>
                {mrp > sellingPrice && (
                  <>
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      ₹{mrp.toLocaleString()}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-xs sm:text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {mrp > sellingPrice && (
                <p className="text-green-600 text-sm font-medium">
                  You save ₹{(mrp - sellingPrice).toLocaleString()}!
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                inclusive of all taxes
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
                Select Color
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {variants.map((variant, index) => {
                  const isSelected = selectedVariantIndex === index;
                  const firstSize = variant.sizes?.[0];
                  const variantPrice = firstSize?.selling_price || 0;
                  const variantMrp = firstSize?.mrp || 0;
                  const variantDiscount =
                    variantMrp > variantPrice
                      ? Math.round(((variantMrp - variantPrice) / variantMrp) * 100)
                      : 0;

                  return (
                    <button
                      key={variant._id || index}
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
                        <p className={`font-medium text-sm ${
                          isSelected ? "text-pink-700" : "text-gray-900"
                        }`}>
                          {variant.color}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          ₹{variantPrice.toLocaleString()}
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
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {validSizes.map((sizeOption, index) => {
                    const isSelected = selectedSizeIndex === index;
                    const isOutOfStock = sizeOption.quantity === 0;

                    return (
                      <button
                        key={sizeOption._id || index}
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
                        <span className="font-medium text-sm">
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

            {/* Add to Cart / Go to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isInCart && (hasValidSizes ? (!selectedSize || selectedSize.quantity === 0 || isAddingToCart) : isAddingToCart)}
              className={`w-full font-semibold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg mb-4 cursor-pointer ${
                isInCart
                  ? "bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 shadow-pink-100"
                  : "bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white shadow-pink-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {isInCart
                ? "Go to Cart"
                : isAddingToCart
                ? "Adding..."
                : hasValidSizes
                ? (!selectedSize || selectedSize.quantity === 0 ? "Out of Stock" : "Add to Cart")
                : "Add to Cart"}
            </button>

            {/* Product Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 uppercase text-sm tracking-wide">
                Product Details
              </h3>
              <div className="space-y-3">
                {product.description && (
                  <div 
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 uppercase text-sm tracking-wide">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Fabric
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {product.fabric || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="text-sm text-gray-900 font-medium capitalize">
                    {product.category || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p className="text-sm text-gray-900 font-medium capitalize">
                    {product.status || "Active"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Total Stock
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {hasValidSizes ? (selectedSize && selectedSize.quantity > 0 ? `${selectedSize.quantity} units` : "Out of Stock") : "One Size"}
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
