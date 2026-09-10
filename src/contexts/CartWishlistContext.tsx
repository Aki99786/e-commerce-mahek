"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { cartService } from "@/features/cart/services/cart.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { AUTH_CHANGE_EVENT, isAuthenticated } from "@/lib/auth-utils";

interface CartWishlistContextType {
  cartCount: number;
  wishlistCount: number;
  wishlistedProductIds: Set<string>;
  wishlistedSizeIds: Set<string>;
  cartedProductIds: Set<string>;
  cartedSizeIds: Set<string>;
  refreshCounts: () => Promise<void>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  incrementWishlistCount: () => void;
  decrementWishlistCount: () => void;
  addToWishlistedIds: (productId: string) => void;
  addToWishlistedSizeIds: (sizeId: string) => void;
  removeFromWishlistedIds: (productId: string) => void;
  removeFromWishlistedSizeIds: (sizeId: string) => void;
  addToCartedIds: (productId: string) => void;
  addToCartedSizeIds: (sizeId: string) => void;
  getWishlistItemId: (productId: string) => string | undefined;
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
  const [wishlistedSizeIds, setWishlistedSizeIds] = useState<Set<string>>(new Set());
  const [wishlistItemMap, setWishlistItemMap] = useState<Map<string, string>>(new Map());
  const [cartedProductIds, setCartedProductIds] = useState<Set<string>>(new Set());
  const [cartedSizeIds, setCartedSizeIds] = useState<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  const getWishlistItemId = useCallback((productId: string): string | undefined => {
    return wishlistItemMap.get(productId);
  }, [wishlistItemMap]);

  const fetchCounts = useCallback(async () => {
    if (inFlightRef.current) return;

    if (!isAuthenticated()) {
      setCartCount(0);
      setWishlistCount(0);
      setWishlistedProductIds(new Set());
      setWishlistedSizeIds(new Set());
      setWishlistItemMap(new Map());
      setCartedProductIds(new Set());
      setCartedSizeIds(new Set());
      return;
    }

    inFlightRef.current = true;
    try {
      const [cartList, wishlist] = await Promise.all([
        cartService.getCartList(),
        wishlistService.getWishlist(),
      ]);

      const cartItems = cartList?.data?.list ?? [];
      const nextCartCount = cartItems.reduce((total: number, item) => total + (item?.quantity ?? 0), 0);
      const nextWishlistCount = wishlist?.total ?? wishlist?.list?.length ?? 0;

      const itemMap = new Map<string, string>();
      const productIds = new Set<string>();
      (wishlist?.list ?? []).forEach((item: any) => {
        if (item?.product_id) {
          productIds.add(item.product_id);
          if (item._id) {
            itemMap.set(item.product_id, item._id);
          }
        }
      });

      const nextCartedIds = new Set(cartItems.map((item: any) => item?.product_id).filter(Boolean) as string[]);
      const nextCartedSizeIds = new Set(cartItems.map((item: any) => item?.size_id).filter(Boolean) as string[]);
      const nextWishlistedSizeIds = new Set(
        (wishlist?.list ?? []).map((item: any) => item?.variant?.size_id || item?.size_id).filter(Boolean) as string[]
      );

      setCartCount((prev) => (prev === nextCartCount ? prev : nextCartCount));
      setWishlistCount((prev) => (prev === nextWishlistCount ? prev : nextWishlistCount));
      setWishlistedProductIds((prev) => (setsEqual(prev, productIds) ? prev : productIds));
      setWishlistedSizeIds((prev) => (setsEqual(prev, nextWishlistedSizeIds) ? prev : nextWishlistedSizeIds));
      setWishlistItemMap(itemMap);
      setCartedProductIds((prev) => (setsEqual(prev, nextCartedIds) ? prev : nextCartedIds));
      setCartedSizeIds((prev) => (setsEqual(prev, nextCartedSizeIds) ? prev : nextCartedSizeIds));
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

  const refreshCounts = useCallback(async () => {
    await fetchCounts();
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

  const addToWishlistedSizeIds = useCallback((sizeId: string) => {
    setWishlistedSizeIds((prev) => {
      if (prev.has(sizeId)) return prev;
      const next = new Set(prev);
      next.add(sizeId);
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
    setWishlistItemMap((prev) => {
      if (!prev.has(productId)) return prev;
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const removeFromWishlistedSizeIds = useCallback((sizeId: string) => {
    setWishlistedSizeIds((prev) => {
      if (!prev.has(sizeId)) return prev;
      const next = new Set(prev);
      next.delete(sizeId);
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

  const addToCartedSizeIds = useCallback((sizeId: string) => {
    setCartedSizeIds((prev) => {
      if (prev.has(sizeId)) return prev;
      const next = new Set(prev);
      next.add(sizeId);
      return next;
    });
  }, []);

  const value = useMemo<CartWishlistContextType>(
    () => ({
      cartCount,
      wishlistCount,
      wishlistedProductIds,
      wishlistedSizeIds,
      cartedProductIds,
      cartedSizeIds,
      refreshCounts,
      incrementCartCount,
      decrementCartCount,
      incrementWishlistCount,
      decrementWishlistCount,
      addToWishlistedIds,
      addToWishlistedSizeIds,
      removeFromWishlistedIds,
      removeFromWishlistedSizeIds,
      addToCartedIds,
      addToCartedSizeIds,
      getWishlistItemId,
    }),
    [
      cartCount,
      wishlistCount,
      wishlistedProductIds,
      wishlistedSizeIds,
      cartedProductIds,
      cartedSizeIds,
      refreshCounts,
      incrementCartCount,
      decrementCartCount,
      incrementWishlistCount,
      decrementWishlistCount,
      addToWishlistedIds,
      addToWishlistedSizeIds,
      removeFromWishlistedIds,
      removeFromWishlistedSizeIds,
      addToCartedIds,
      addToCartedSizeIds,
      getWishlistItemId,
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
