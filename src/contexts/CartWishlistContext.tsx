"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartService } from "@/features/cart/services/cart.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { isAuthenticated } from "@/lib/auth-utils";

interface CartWishlistContextType {
  cartCount: number;
  wishlistCount: number;
  wishlistedProductIds: Set<string>;
  cartedProductIds: Set<string>;
  refreshCounts: () => Promise<void>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  incrementWishlistCount: () => void;
  decrementWishlistCount: () => void;
  addToWishlistedIds: (productId: string) => void;
  removeFromWishlistedIds: (productId: string) => void;
  addToCartedIds: (productId: string) => void;
  getWishlistItemId: (productId: string) => string | undefined;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export function CartWishlistProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<string>>(new Set());
  const [wishlistItemMap, setWishlistItemMap] = useState<Map<string, string>>(new Map());
  const [cartedProductIds, setCartedProductIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const getWishlistItemId = (productId: string): string | undefined => {
    return wishlistItemMap.get(productId);
  };

  const fetchCounts = async () => {
    if (!isAuthenticated()) {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistedProductIds(new Set());
      setWishlistItemMap(new Map());
      return;
    }

    try {
      const [cartList, wishlist] = await Promise.all([
        cartService.getCartList(),
        wishlistService.getWishlist(),
      ]);
      const cartItems = cartList?.data?.list ?? [];
      setCartCount(cartItems.reduce((total, item) => total + (item?.quantity ?? 0), 0));
      setWishlistCount(wishlist?.total ?? wishlist?.list?.length ?? 0);
      
      const itemMap = new Map<string, string>();
      const productIds = new Set<string>();
      (wishlist?.list ?? []).forEach((item) => {
        if (item?.product_id) {
          productIds.add(item.product_id);
          if (item._id) {
            itemMap.set(item.product_id, item._id);
          }
        }
      });
      setWishlistedProductIds(productIds);
      setWishlistItemMap(itemMap);

      setCartedProductIds(new Set(cartItems.map((item) => item?.product_id).filter(Boolean)));
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCounts();

    const handleStorageChange = () => {
      fetchCounts();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      if (isAuthenticated()) {
        fetchCounts();
      }
    }, 30000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [mounted]);

  const refreshCounts = async () => {
    await fetchCounts();
  };

  const incrementCartCount = () => setCartCount((prev) => prev + 1);
  const decrementCartCount = () => setCartCount((prev) => Math.max(0, prev - 1));
  const incrementWishlistCount = () => setWishlistCount((prev) => prev + 1);
  const decrementWishlistCount = () => setWishlistCount((prev) => Math.max(0, prev - 1));
  const addToWishlistedIds = (productId: string) =>
    setWishlistedProductIds((prev) => new Set(prev).add(productId));
  const removeFromWishlistedIds = (productId: string) => {
    setWishlistedProductIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    setWishlistItemMap((prev) => {
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
  };
  const addToCartedIds = (productId: string) =>
    setCartedProductIds((prev) => new Set(prev).add(productId));

  return (
    <CartWishlistContext.Provider
      value={{
        cartCount,
        wishlistCount,
        wishlistedProductIds,
        cartedProductIds,
        refreshCounts,
        incrementCartCount,
        decrementCartCount,
        incrementWishlistCount,
        decrementWishlistCount,
        addToWishlistedIds,
        removeFromWishlistedIds,
        addToCartedIds,
        getWishlistItemId,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (context === undefined) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
}
