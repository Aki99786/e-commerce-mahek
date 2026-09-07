"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth-utils";
import { EmptyWishlist } from "@/components/empty-states/EmptyWishlist";
import { WishlistItem } from "@/features/wishlist/components/WishlistItem";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import type { UIWishlistItem } from "@/features/wishlist/adapters/wishlist.adapter";
import { adaptWishlistResponseToUI } from "@/features/wishlist/adapters/wishlist.adapter";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes";

export default function WishlistPage() {
  const router = useRouter();
  const {
    incrementCartCount,
    decrementWishlistCount,
    cartedProductIds,
    removeFromWishlistedIds,
    addToCartedIds,
  } = useCartWishlist();

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<UIWishlistItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_LIMIT = 12;

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  // Fetch initial batch (limit: 12, offset: 0)
  const fetchInitialWishlist = async () => {
    setLoading(true);
    try {
      const response = await wishlistService.getWishlist({
        limit: PAGE_LIMIT,
        offset: 0,
      });

      const adaptedItems = adaptWishlistResponseToUI(response?.list ?? []);
      setWishlistItems(adaptedItems);

      const total = response?.total ?? adaptedItems.length;
      setTotalItems(total);
      setCurrentOffset(0);
      setHasMore(adaptedItems.length < total && adaptedItems.length >= PAGE_LIMIT);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
      setTotalItems(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = checkIsAuthenticated();
    setIsAuth(loggedIn);

    if (loggedIn) {
      fetchInitialWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  // On-scroll Load More (next offset: 1, 2, 3...)
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loading) return;
    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const nextOffset = currentOffset + 1;

    try {
      const response = await wishlistService.getWishlist({
        limit: PAGE_LIMIT,
        offset: nextOffset,
      });

      const newItems = adaptWishlistResponseToUI(response?.list ?? []);

      if (!newItems || newItems.length === 0) {
        setHasMore(false);
      } else {
        setWishlistItems((prev) => {
          const existingIds = new Set(prev.map((i) => i._id));
          const uniqueNew = newItems.filter((i) => !existingIds.has(i._id));
          const updated = [...prev, ...uniqueNew];
          const total = response?.total ?? totalItems;
          if (updated.length >= total || newItems.length < PAGE_LIMIT) {
            setHasMore(false);
          }
          return updated;
        });

        setCurrentOffset(nextOffset);
        if (typeof response?.total === "number") {
          setTotalItems(response.total);
        }
      }
    } catch (error) {
      console.error("Error loading more wishlist items:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, loading, currentOffset, totalItems]);

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "250px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Handle Remove
  const handleRemove = async (wishlistItemId: string) => {
    try {
      const item = wishlistItems.find((i) => i._id === wishlistItemId);
      if (!item?._id) return;

      await wishlistService.removeFromWishlist(item._id);
      setWishlistItems((prev) => prev.filter((i) => i._id !== item._id));
      setTotalItems((prev) => Math.max(0, prev - 1));
      decrementWishlistCount();

      if (item?.product_id) {
        removeFromWishlistedIds(item.product_id);
      }
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
      throw error;
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (productId: string) => {
    try {
      const wishlistItem = wishlistItems.find(
        (item) => item.product._id === productId
      );
      if (!wishlistItem) {
        toast.error("Item not found in wishlist");
        return;
      }

      const sizeId =
        wishlistItem.sizeId ||
        wishlistItem.variant?.size_id ||
        (wishlistItem.variant?.size as unknown as { _id?: string })?._id ||
        "";

      await wishlistService.bulkMoveToCart({
        cartItems: [
          {
            _id: wishlistItem._id,
            productId: wishlistItem.product._id,
            variantId: wishlistItem.variantId,
            size_id: sizeId,
            size: wishlistItem.size,
            quantity: 1,
          },
        ],
      });

      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== wishlistItem._id)
      );
      setTotalItems((prev) => Math.max(0, prev - 1));

      incrementCartCount();
      decrementWishlistCount();

      if (wishlistItem.product._id) {
        removeFromWishlistedIds(wishlistItem.product._id);
        addToCartedIds(wishlistItem.product._id);
      }
      toast.success("Moved to cart successfully");
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Failed to move to cart");
      throw error;
    }
  };

  // Initial Full Screen Skeleton
  if (loading) {
    return (
      <div className="flex-1 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[3/4] w-full bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/5" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-2/5 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <EmptyWishlist />;
  }

  return (
    <div className="flex-1 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!wishlistItems || wishlistItems.length === 0 ? (
          <EmptyWishlist isAuthenticated={true} />
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/70">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  My Wishlist
                </h1>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <a
                href={ROUTES.SHOP}
                className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </a>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {wishlistItems.map((item) => (
                <WishlistItem
                  key={item._id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  isInCart={cartedProductIds.has(item.product._id)}
                />
              ))}
            </div>

            {/* Infinite Scroll Loading Sentinel */}
            <div
              ref={observerTarget}
              className="w-full py-8 flex flex-col justify-center items-center min-h-[60px]"
            >
              {isLoadingMore && (
                <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Loading more items...</span>
                </div>
              )}
              {!hasMore && wishlistItems.length > PAGE_LIMIT && (
                <p className="text-xs text-gray-400 font-medium tracking-wide py-2">
                  You have viewed all {totalItems} items
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
