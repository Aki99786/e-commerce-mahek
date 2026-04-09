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
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export function CartWishlistProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<string>>(new Set());
  const [cartedProductIds, setCartedProductIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const fetchCounts = async () => {
    if (!isAuthenticated()) {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistedProductIds(new Set());
      return;
    }

    try {
      const [cartList, wishlist] = await Promise.all([
        cartService.getCartList(),
        wishlistService.getWishlist(),
      ]);
      setCartCount(cartList.items.reduce((total, item) => total + item.quantity, 0));
      setWishlistCount(wishlist.items.length);
      setWishlistedProductIds(new Set(wishlist.items.map((item) => item.product._id)));
      setCartedProductIds(new Set(cartList.items.map((item) => item.product._id)));
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
  const removeFromWishlistedIds = (productId: string) =>
    setWishlistedProductIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
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
