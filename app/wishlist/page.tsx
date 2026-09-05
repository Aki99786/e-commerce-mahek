"use client";

import { useEffect, useState } from "react";
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
  const { incrementCartCount, decrementWishlistCount, cartedProductIds, removeFromWishlistedIds } = useCartWishlist();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<UIWishlistItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = checkIsAuthenticated();
      setIsAuth(loggedIn);
      setIsLoading(false);

      if (loggedIn) {
        fetchWishlist();
      }
    };

    checkAuth();
  }, []);

  const fetchWishlist = async () => {
    setIsFetching(true);
    try {
      const response = await wishlistService.getWishlist();
      const adaptedItems = adaptWishlistResponseToUI(response?.list ?? []);
      setWishlistItems(adaptedItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemove = async (wishlistItemId: string) => {
    try {
      const item = wishlistItems.find((i) => i._id === wishlistItemId);
      if (!item?._id) return;
      await wishlistService.removeFromWishlist(item._id);
      setWishlistItems((prev) =>
        prev.filter((i) => i._id !== item._id)
      );
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

  const handleAddToCart = async (productId: string) => {
    try {
      const wishlistItem = wishlistItems.find((item) => item.product._id === productId);
      if (!wishlistItem) {
        toast.error("Item not found in wishlist");
        return;
      }

      await wishlistService.moveToCart({
        productId: wishlistItem.product._id,
        variantId: wishlistItem.variantId,
        size: wishlistItem.size,
      });
      
      setWishlistItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
      
      incrementCartCount();
      decrementWishlistCount();
      toast.success("Moved to cart successfully");
      router.push(ROUTES.CART);
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Failed to move to cart");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <EmptyWishlist />;
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {isFetching ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-36 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="mt-auto h-8 bg-gray-200 rounded-xl w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <EmptyWishlist isAuthenticated={true} />
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <a href={ROUTES.SHOP} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </a>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
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
          </div>
        )}
      </div>
    </div>
  );
}
