"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { cartService } from "@/features/cart/services/cart.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { AUTH_CHANGE_EVENT, isAuthenticated } from "@/lib/auth-utils";

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

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

export function CartWishlistProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<string>>(new Set());
  const [cartedProductIds, setCartedProductIds] = useState<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  const fetchCounts = useCallback(async () => {
    if (inFlightRef.current) return;

    if (!isAuthenticated()) {
      setCartCount((prev) => (prev === 0 ? prev : 0));
      setWishlistCount((prev) => (prev === 0 ? prev : 0));
      setWishlistedProductIds((prev) => (prev.size === 0 ? prev : new Set()));
      setCartedProductIds((prev) => (prev.size === 0 ? prev : new Set()));
      return;
    }

    inFlightRef.current = true;
    try {
      const [cartList, wishlist] = await Promise.all([
        cartService.getCartList(),
        wishlistService.getWishlist(),
      ]);

      const nextCartCount = cartList.items.reduce((total, item) => total + item.quantity, 0);
      const nextWishlistCount = wishlist.items.length;
      const nextWishlistedIds = new Set(
        wishlist.items.filter((item) => item.product != null).map((item) => item.product._id),
      );
      const nextCartedIds = new Set(
        cartList.items.filter((item) => item.product != null).map((item) => item.product._id),
      );

      setCartCount((prev) => (prev === nextCartCount ? prev : nextCartCount));
      setWishlistCount((prev) => (prev === nextWishlistCount ? prev : nextWishlistCount));
      setWishlistedProductIds((prev) => (setsEqual(prev, nextWishlistedIds) ? prev : nextWishlistedIds));
      setCartedProductIds((prev) => (setsEqual(prev, nextCartedIds) ? prev : nextCartedIds));
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchCounts();

    const handleAuthOrStorageChange = () => {
      fetchCounts();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated()) {
        fetchCounts();
      }
    };

    window.addEventListener("storage", handleAuthOrStorageChange);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthOrStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleAuthOrStorageChange);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthOrStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchCounts]);

  const incrementCartCount = useCallback(() => setCartCount((prev) => prev + 1), []);
  const decrementCartCount = useCallback(() => setCartCount((prev) => Math.max(0, prev - 1)), []);
  const incrementWishlistCount = useCallback(() => setWishlistCount((prev) => prev + 1), []);
  const decrementWishlistCount = useCallback(() => setWishlistCount((prev) => Math.max(0, prev - 1)), []);
  const addToWishlistedIds = useCallback((productId: string) => {
    setWishlistedProductIds((prev) => {
      if (prev.has(productId)) return prev;
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);
  const removeFromWishlistedIds = useCallback((productId: string) => {
    setWishlistedProductIds((prev) => {
      if (!prev.has(productId)) return prev;
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, []);
  const addToCartedIds = useCallback((productId: string) => {
    setCartedProductIds((prev) => {
      if (prev.has(productId)) return prev;
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);

  const value = useMemo<CartWishlistContextType>(
    () => ({
      cartCount,
      wishlistCount,
      wishlistedProductIds,
      cartedProductIds,
      refreshCounts: fetchCounts,
      incrementCartCount,
      decrementCartCount,
      incrementWishlistCount,
      decrementWishlistCount,
      addToWishlistedIds,
      removeFromWishlistedIds,
      addToCartedIds,
    }),
    [
      cartCount,
      wishlistCount,
      wishlistedProductIds,
      cartedProductIds,
      fetchCounts,
      incrementCartCount,
      decrementCartCount,
      incrementWishlistCount,
      decrementWishlistCount,
      addToWishlistedIds,
      removeFromWishlistedIds,
      addToCartedIds,
    ],
  );

  return (
    <CartWishlistContext.Provider value={value}>
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
