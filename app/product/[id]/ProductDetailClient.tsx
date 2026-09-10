"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, Check, CheckCircle2, Pencil, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { WriteReviewModal, ReviewSubmissionData } from "@/components/review/WriteReviewModal";
import type { Product } from "@/features/products/types";
import { productService } from "@/features/products/services/product.service";
import { cartService } from "@/features/cart/services/cart.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { isAuthenticated } from "@/lib/auth-utils";
import { ROUTES } from "@/constants/routes";
import { ToastService } from "@/lib/toast";
import { getColorCode, getColorName } from "@/lib/utils/color";

interface ProductDetailClientProps {
  product: Product;
}

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  author: string;
  initials: string;
  avatarBg: string;
  verified: boolean;
  images?: string[];
}

const STATIC_REVIEWS: ReviewItem[] = [
  {
    id: "1",
    rating: 5,
    title: "Amazing Product",
    date: "12 Aug 2025",
    comment:
      "Very good quality and exactly as shown in the pictures. Delivery was on time and packaging was also very good. Highly recommended!",
    author: "Rahul Kumar",
    initials: "RK",
    avatarBg: "bg-purple-100 text-purple-700",
    verified: true,
  },
  {
    id: "2",
    rating: 4,
    title: "Good Quality",
    date: "10 Aug 2025",
    comment:
      "Product is really nice and value for money. The color is just like shown. Only delivery took a little longer than expected.",
    author: "Priya Sharma",
    initials: "PS",
    avatarBg: "bg-rose-100 text-rose-700",
    verified: true,
  },
  {
    id: "3",
    rating: 5,
    title: "Excellent!",
    date: "08 Aug 2025",
    comment:
      "I loved the product. The build quality is very good and it works perfectly. Will definitely buy again.",
    author: "Amit Kumar",
    initials: "AK",
    avatarBg: "bg-sky-100 text-sky-700",
    verified: true,
  },
  {
    id: "4",
    rating: 5,
    title: "Truly Royal & Elegant",
    date: "02 Aug 2025",
    comment:
      "The embroidery and weaving are top notch. Got so many compliments in the family wedding. Worth every single rupee!",
    author: "Sneha Patel",
    initials: "SP",
    avatarBg: "bg-amber-100 text-amber-700",
    verified: true,
  },
  {
    id: "5",
    rating: 4,
    title: "Worth the Price",
    date: "25 Jul 2025",
    comment:
      "Fabric is genuine and comfortable to wear for long events. Fitting was spot on according to the size guide.",
    author: "Meera Joshi",
    initials: "MJ",
    avatarBg: "bg-emerald-100 text-emerald-700",
    verified: true,
  },
  {
    id: "6",
    rating: 5,
    title: "Beyond Expectations",
    date: "18 Jul 2025",
    comment:
      "The finish is immaculate. Looks even better in real life than on screen. Delivery was fast and hassle free.",
    author: "Rohit Verma",
    initials: "RV",
    avatarBg: "bg-indigo-100 text-indigo-700",
    verified: true,
  },
];

const isColorLight = (hex: string) => {
  if (!hex || !hex.startsWith("#") || hex.length !== 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 185;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const [productData, setProductData] = useState<Product>(product);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomPreviewRef = useRef<HTMLDivElement>(null);

  // Reviews state
  const [showRateModal, setShowRateModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>(STATIC_REVIEWS);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setProductData(product);
  }, [product]);

  const fetchedIdRef = useRef<string | null>(null);

  // Client-side authenticated re-fetch: Next.js SSR runs without localStorage token,
  // so fetching client-side ensures is_cart_active and is_wishlist reflect the logged-in user!
  // fetchedIdRef prevents duplicate calls caused by React StrictMode in development.
  useEffect(() => {
    if (isAuthenticated() && product._id && fetchedIdRef.current !== product._id) {
      fetchedIdRef.current = product._id;
      productService
        .getProductById(product._id)
        .then((fresh) => {
          if (fresh && fresh._id) {
            setProductData(fresh);
          }
        })
        .catch((err) => {
          console.error("Client product refresh error:", err);
        });
    }
  }, [product._id]);

  const {
    incrementCartCount,
    incrementWishlistCount,
    decrementWishlistCount,
    refreshCounts,
    cartedProductIds,
    cartedSizeIds,
    addToCartedIds,
    addToCartedSizeIds,
    wishlistedProductIds,
    wishlistedSizeIds,
    addToWishlistedIds,
    addToWishlistedSizeIds,
    removeFromWishlistedIds,
    removeFromWishlistedSizeIds,
    getWishlistItemId,
  } = useCartWishlist();

  const variants =
    productData.product_variants && productData.product_variants.length > 0
      ? productData.product_variants
      : productData.variant
        ? [productData.variant]
        : [];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  const validSizes = selectedVariant?.sizes?.filter((s) => s !== null && s !== undefined) || [];
  const selectedSize = validSizes[selectedSizeIndex] || validSizes[0];
  const images = selectedVariant?.images || [];
  const hasValidSizes = validSizes.length > 0;

  // Key to identify selected size/variant
  const currentItemKey = selectedSize?._id || `${selectedVariantIndex}_${selectedSizeIndex}`;

  // Track runtime user changes per size
  const [userCartMap, setUserCartMap] = useState<Record<string, boolean>>({});
  const [userWishlistMap, setUserWishlistMap] = useState<Record<string, boolean>>({});

  // Direct size-based status from API or Context (ensures immediate feedback from context + API)
  const isSizeInCart =
    (selectedSize?._id && cartedSizeIds.has(selectedSize._id)) ||
    Boolean(selectedSize?.is_cart_active);

  const isInCart =
    userCartMap[currentItemKey] !== undefined
      ? userCartMap[currentItemKey]
      : isSizeInCart;

  const isSizeInWishlist =
    (selectedSize?._id && wishlistedSizeIds.has(selectedSize._id)) ||
    Boolean(selectedSize?.is_wishlist);

  const isInWishlist =
    userWishlistMap[currentItemKey] !== undefined
      ? userWishlistMap[currentItemKey]
      : isSizeInWishlist;

  const sellingPrice = selectedSize ? selectedSize.selling_price : 0;
  const mrp = selectedSize ? selectedSize.mrp : 0;
  const discount =
    mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

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
            productId: productData._id,
            variantId: selectedVariant._id,
            size: hasValidSizes ? selectedSize?.size || "ONE_SIZE" : "ONE_SIZE",
            size_id: selectedSize?._id,
            quantity: 1,
          },
        ],
      });
      setUserCartMap((prev) => ({ ...prev, [currentItemKey]: true }));
      addToCartedIds(productData._id);
      if (selectedSize?._id) {
        addToCartedSizeIds(selectedSize._id);
      }
      incrementCartCount();
      await refreshCounts();
      ToastService.success("Added to Bag successfully!");
    } catch {
      ToastService.error("Failed to add product to bag");
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
        const wishlistItemId = getWishlistItemId(productData._id);
        if (wishlistItemId) {
          await wishlistService.removeFromWishlist(wishlistItemId);
        }
        setUserWishlistMap((prev) => ({ ...prev, [currentItemKey]: false }));
        removeFromWishlistedIds(productData._id);
        if (selectedSize?._id) {
          removeFromWishlistedSizeIds(selectedSize._id);
        }
        decrementWishlistCount();
        ToastService.info("Removed from Wishlist");
      } else {
        await wishlistService.addToWishlist({
          wishlistItems: [
            {
              productId: productData._id,
              variantId: selectedVariant._id,
              size_id: selectedSize?._id,
              size: hasValidSizes ? selectedSize?.size || "ONE_SIZE" : "ONE_SIZE",
            },
          ],
        });
        setUserWishlistMap((prev) => ({ ...prev, [currentItemKey]: true }));
        addToWishlistedIds(productData._id);
        if (selectedSize?._id) {
          addToWishlistedSizeIds(selectedSize._id);
        }
        incrementWishlistCount();
        ToastService.success("Added to Wishlist");
      }
      await refreshCounts();
    } catch {
      ToastService.error("Failed to update wishlist");
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

  const handleAddNewReview = (reviewData: ReviewSubmissionData) => {
    const created: ReviewItem = {
      id: Date.now().toString(),
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      author: "Verified Customer",
      initials: "VC",
      avatarBg: "bg-red-100 text-[#C1272D]",
      date: "Today",
      verified: true,
      images: reviewData.images,
    };

    setReviews((prev) => [created, ...prev]);
  };

  const visibleReviews = isReviewsExpanded ? reviews : reviews.slice(0, 3);

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* Left Side - Image Gallery (5 cols: Sticky on desktop during scroll) */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:flex-row lg:gap-3.5 lg:sticky lg:top-28 self-start w-full">
            {/* Main Image */}
            <div className="flex-1 relative order-1 lg:order-2 lg:max-w-[395px] w-full">
              <div
                ref={imageRef}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 cursor-crosshair border border-gray-100 shadow-sm"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {images[selectedImageIndex] ? (
                  <Image
                    src={images[selectedImageIndex]}
                    alt={productData.product_name}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image Available
                  </div>
                )}

                {/* Sale Badge */}
                {productData.is_sale && (
                  <span className="absolute top-4 left-4 bg-[#C1272D] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-md shadow-md z-10 pointer-events-none">
                    SALE
                  </span>
                )}

                {/* Zoom Lens Overlay */}
                {showZoom && (
                  <div
                    ref={lensRef}
                    className="absolute w-32 h-32 border-2 border-white/80 shadow-lg pointer-events-none bg-white/20 z-10 hidden lg:block"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setShowZoom(false);
                      }}
                      onMouseMove={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseLeave={() => {
                        setShowZoom(true);
                      }}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-md hover:shadow-lg transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 border border-gray-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setShowZoom(false);
                      }}
                      onMouseMove={(e) => {
                        e.stopPropagation();
                      }}
                      onMouseLeave={() => {
                        setShowZoom(true);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-md hover:shadow-lg transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 border border-gray-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium z-20 pointer-events-none select-none">
                    {selectedImageIndex + 1}/{images.length}
                  </div>
                )}
              </div>

              {/* Zoomed Image Preview */}
              {showZoom && images[selectedImageIndex] && (
                <div className="absolute left-full ml-4 top-0 w-96 h-96 rounded-2xl overflow-hidden bg-white shadow-2xl border-2 border-gray-200 hidden lg:block z-50">
                  <div
                    ref={zoomPreviewRef}
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${images[selectedImageIndex]})`,
                      backgroundSize: "250%",
                      backgroundPosition: "50% 50%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="order-2 lg:order-1 flex flex-row gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:gap-3 lg:overflow-x-visible lg:overflow-y-auto lg:w-20 lg:max-h-[580px] lg:pb-0 scrollbar-thin scrollbar-thumb-gray-300">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 w-16 sm:w-20 lg:w-full cursor-pointer ${selectedImageIndex === index
                      ? "border-[#C1272D] shadow-sm"
                      : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${productData.product_name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 80px, 80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Brand Tag */}
            <div className="mb-2.5">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                {productData.brand || "SABYASACHI"}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight leading-snug">
              {productData.product_name}
            </h1>

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ₹{sellingPrice.toLocaleString()}
              </span>
              {mrp > sellingPrice && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through font-normal">
                    ₹{mrp.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="border-b border-gray-100 mb-5" />

            {/* Color Selection - Reusing existing color utilities */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-900 mb-2.5">
                Color:{" "}
                <span className="font-normal text-gray-600 capitalize">
                  {selectedVariant ? getColorName(selectedVariant.color) : "Default"}
                </span>
              </p>
              <div className="flex items-center gap-3">
                {variants.map((variant, index) => {
                  const isSelected = selectedVariantIndex === index;
                  const colorHex = getColorCode(variant.color);
                  const isLight = isColorLight(colorHex);

                  return (
                    <button
                      key={variant._id || index}
                      type="button"
                      title={getColorName(variant.color)}
                      onClick={() => {
                        setSelectedVariantIndex(index);
                        setSelectedSizeIndex(0);
                        setSelectedImageIndex(0);
                      }}
                      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${isSelected
                        ? "ring-2 ring-offset-2 ring-gray-900 scale-105"
                        : "hover:scale-105 hover:ring-1 hover:ring-gray-300"
                        } ${isLight ? "border border-gray-200" : ""}`}
                      style={{ backgroundColor: colorHex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`}
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection (Without Size Guide Button) */}
            {hasValidSizes && (
              <div className="mb-6">
                <div className="mb-2.5">
                  <p className="text-sm font-medium text-gray-900">
                    Size:{" "}
                    <span className="font-normal text-gray-600">
                      {selectedSize ? selectedSize.size : "Select a size"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-start gap-3">
                  {validSizes.map((sizeOption, index) => {
                    const isSelected = selectedSizeIndex === index;
                    const isOutOfStock = sizeOption.quantity === 0;
                    const isLowStock = sizeOption.quantity > 0 && sizeOption.quantity <= 5;

                    return (
                      <div key={sizeOption._id || index} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => !isOutOfStock && setSelectedSizeIndex(index)}
                          disabled={isOutOfStock}
                          className={`min-w-[56px] h-10 px-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center relative cursor-pointer ${isOutOfStock
                            ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed overflow-hidden"
                            : isSelected
                              ? "border-2 border-gray-900 text-gray-900 bg-white font-semibold shadow-xs"
                              : "border border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                            }`}
                        >
                          <span>{sizeOption.size}</span>
                          {isOutOfStock && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="w-full h-[1.5px] bg-gray-300 rotate-45" />
                            </span>
                          )}
                        </button>

                        {isSelected && isLowStock && (
                          <span className="text-[10px] text-red-500 font-medium mt-1 leading-none">
                            {sizeOption.quantity} left
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Row: ADD TO CART / GO TO CART + Wishlist Button */}
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  !isInCart &&
                  (hasValidSizes
                    ? !selectedSize || selectedSize.quantity === 0 || isAddingToCart
                    : isAddingToCart)
                }
                className={`flex-1 h-[52px] sm:h-[54px] px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md tracking-wider uppercase disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.99] ${
                  isInCart
                    ? "bg-white hover:bg-red-50/50 text-[#C1272D] border-2 border-[#C1272D] shadow-sm"
                    : "bg-[#C1272D] hover:bg-[#a81f25] text-white shadow-red-900/20"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isInCart
                    ? "GO TO BAG"
                    : isAddingToCart
                      ? "ADDING..."
                      : hasValidSizes && (!selectedSize || selectedSize.quantity === 0)
                        ? "OUT OF STOCK"
                        : "ADD TO CART"}
                </span>
                {isInCart && <ArrowRight className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isAddingToWishlist}
                aria-label="Add to wishlist"
                className="w-[52px] h-[52px] sm:w-[54px] sm:h-[54px] border border-gray-300 hover:border-gray-400 rounded-xl flex items-center justify-center transition-all hover:bg-gray-50 flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${isInWishlist ? "fill-[#C1272D] text-[#C1272D]" : "text-gray-700"
                    }`}
                />
              </button>
            </div>

            {/* Product Details Section - Only show if real description exists */}
            {productData.description && productData.description.replace(/<[^>]*>/g, "").trim().length > 0 && (
              <div className="mb-6 pt-2">
                <h3 className="text-base font-bold text-gray-900 mb-2.5">
                  Product Details
                </h3>
                <div
                  className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: productData.description }}
                />
              </div>
            )}

            {/* CUSTOMER REVIEWS SECTION (Theme-Aligned & Matched to user design) */}
            <div className="border-t border-gray-100 pt-8 mt-2">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Customer Reviews
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    See what our customers are saying about this product.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRateModal(true)}
                  className="border border-[#C1272D] text-[#C1272D] hover:bg-red-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Pencil className="w-4 h-4 text-[#C1272D]" />
                  Write a Review
                </button>
              </div>

              {/* Rating Overview & Breakdown Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-6 shadow-xs">
                {/* Score badge */}
                <div className="bg-red-50/40 rounded-2xl p-5 text-center min-w-[170px] w-full md:w-auto border border-red-100/60">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">4.3</span>
                    <span className="text-lg font-medium text-gray-400">/ 5</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <Star className="w-4 h-4 text-amber-200 fill-amber-200" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    Based on 1,248 reviews
                  </p>
                </div>

                {/* Rating Breakdown Progress Bars */}
                <div className="flex-1 w-full space-y-2">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 mb-2">
                    Rating Breakdown
                  </p>
                  {[
                    { star: 5, pct: 72, count: 899 },
                    { star: 4, pct: 18, count: 224 },
                    { star: 3, pct: 6, count: 75 },
                    { star: 2, pct: 2, count: 26 },
                    { star: 1, pct: 2, count: 24 },
                  ].map((item) => (
                    <div key={item.star} className="flex items-center text-xs text-gray-600">
                      <span className="w-7 font-medium flex items-center gap-0.5">
                        {item.star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-3">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="w-20 text-right font-medium text-gray-400">
                        {item.pct}% ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List in same listing */}
              <div className="space-y-4">
                {visibleReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors shadow-xs"
                  >
                    {/* Author row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${rev.avatarBg}`}
                        >
                          {rev.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 leading-snug">
                            {rev.author}
                          </p>
                          {rev.verified && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
                    </div>

                    {/* Star row */}
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= rev.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200"
                            }`}
                        />
                      ))}
                    </div>

                    {/* Review Title & Comment */}
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {rev.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Review Images if attached */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 pt-2">
                        {rev.images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <Image
                              src={img}
                              alt="Review attachment"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Reviews inline button (No separate dialog!) */}
              {reviews.length > 3 && (
                <button
                  type="button"
                  onClick={() => setIsReviewsExpanded((prev) => !prev)}
                  className="border border-[#C1272D] text-[#C1272D] hover:bg-red-50 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 mx-auto transition-colors cursor-pointer mt-6"
                >
                  <span>{isReviewsExpanded ? "Show Less Reviews" : "Load More Reviews"}</span>
                  {isReviewsExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#C1272D]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C1272D]" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <WriteReviewModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        onSubmit={handleAddNewReview}
      />
    </div>
  );
}
