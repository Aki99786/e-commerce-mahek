"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage, ProductLabelType } from "@/types/product";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { useCartWishlist } from "@/contexts/CartWishlistContext";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  productId: string;
  variantId: string;
  size_id?: string;
  size: string;
  label?: {
    type: ProductLabelType;
    text: string;
  };
  bestseller?: boolean;
}

export const ProductImageGallery = ({
  images,
  productName: _productName,
  productId,
  variantId,
  size_id,
  size,
  label,
  bestseller,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { incrementWishlistCount, decrementWishlistCount, getWishlistItemId, refreshCounts } = useCartWishlist();

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[selectedImage] || images[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide">
        <button
          onClick={handlePrevious}
          className="lg:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index ? "border-primary" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
        
        <button
          onClick={handleNext}
          className="lg:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 relative">
        <div
          className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-50 cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? "scale-300" : "scale-100"
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
            priority
          />

          {label && (
            <div className="absolute top-4 left-4 z-10">
              <span
                className={`px-3 py-1.5 text-xs font-semibold text-white rounded ${
                  label.type === ProductLabelType.NEW ? "bg-cyan-500" : "bg-red-600"
                }`}
              >
                {label.text}
              </span>
            </div>
          )}

          {bestseller && (
            <div className="absolute top-14 left-4 z-10">
              <span className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded">
                BEST SELLER
              </span>
            </div>
          )}

          <button
            onClick={async () => {
              try {
                setIsAddingToWishlist(true);
                if (isWishlisted) {
                  const wishlistItemId = getWishlistItemId(productId);
                  if (wishlistItemId) {
                    await wishlistService.removeFromWishlist(wishlistItemId);
                  }
                  setIsWishlisted(false);
                  decrementWishlistCount();
                } else {
                  await wishlistService.addToWishlist({ productId, variantId, size_id, size });
                  setIsWishlisted(true);
                  incrementWishlistCount();
                  await refreshCounts();
                }
              } catch (error) {
                console.error("Failed to update wishlist:", error);
              } finally {
                setIsAddingToWishlist(false);
              }
            }}
            disabled={isAddingToWishlist}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-5 h-5 ${
                isWishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-700"
              }`}
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
        </div>

        <button
          onClick={handlePrevious}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-all items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
