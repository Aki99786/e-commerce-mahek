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
  const { incrementCartCount, decrementWishlistCount, cartedProductIds } = useCartWishlist();
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
      const adaptedItems = adaptWishlistResponseToUI(response.items || []);
      setWishlistItems(adaptedItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const item = wishlistItems.find((i) => i.product._id === productId);
      if (!item) return;
      await wishlistService.removeFromWishlist({
        productId: item.product._id,
        variantId: item.variantId,
        size: item.size,
      });
      setWishlistItems((prev) =>
        prev.filter((i) => i.product._id !== productId)
      );
      decrementWishlistCount();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <EmptyWishlist />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container-fluid py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {isFetching ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : !wishlistItems || wishlistItems.length === 0 ? (
              <EmptyWishlist isAuthenticated={true} />
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <h1 className="text-2xl font-playfair font-bold text-gray-900">My Wishlist</h1>
                  <span className="text-sm text-gray-400 font-poppins bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex flex-col gap-3 max-w-2xl">
                  {wishlistItems.map((item) => (
                    <WishlistItem
                      key={item._id || `${item.product._id}-${item.variantId}`}
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
      </div>
    </div>
  );
}
