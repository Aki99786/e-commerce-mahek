"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyCart } from "@/components/empty-states/EmptyCart";
import { isAuthenticated } from "@/lib/auth-utils";
import { cartService } from "@/features/cart/services/cart.service";
import { CartItem } from "@/features/cart/components/CartItem";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import type { UICartItem } from "@/features/cart/adapters/cart.adapter";
import { enrichCartItemsWithImages } from "@/features/cart/adapters/cart.adapter";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/lib/toast";

export default function CartPage() {
  const router = useRouter();
  const { refreshCounts } = useCartWishlist();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [cartItems, setCartItems] = useState<UICartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);
      
      if (authenticated) {
        fetchCartItems();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCartList();
      const enrichedItems = await enrichCartItemsWithImages(response.items || []);
      setCartItems(enrichedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (variantId: string, size: string, quantity: number) => {
    try {
      const item = cartItems.find(i => i.variantId === variantId && i.size === size);
      if (!item) return;

      await cartService.updateCart({
        productId: item.product._id,
        variantId,
        size,
        quantity,
      });
      
      toast.success("Cart updated successfully");
      await fetchCartItems();
      await refreshCounts();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (variantId: string, size: string) => {
    try {
      const item = cartItems.find(i => i.variantId === variantId && i.size === size);
      if (!item) return;

      await cartService.removeFromCart({
        productId: item.product._id,
        variantId,
        size,
      });
      
      toast.success("Item removed from cart");
      await fetchCartItems();
      await refreshCounts();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    
    try {
      await cartService.clearCart();
      toast.success("Cart cleared successfully");
      await fetchCartItems();
      await refreshCounts();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = calculateTotal();

  if (isChecking || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <EmptyCart isAuthenticated={false} />;
  }

  if (cartItems.length === 0) {
    return <EmptyCart isAuthenticated={true} />;
  }

  return (
    <div className="flex-1 bg-gray-50 py-5 sm:py-8">
      <div className="container-fluid max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-5 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 items-start">

          {/* Cart Items Column */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItem
                key={`${item.variantId}-${item.size}`}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}

            {/* Clear cart */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1 lg:sticky lg:top-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Summary header */}
              <div className="bg-gradient-to-r from-[#1a0a0a] to-[#3d1515] px-5 py-4">
                <h2 className="text-base font-bold text-white">Order Summary</h2>
              </div>

              {/* Summary body */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    FREE
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="font-bold text-lg text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="px-5 pb-5 space-y-2.5">
                <button
                  onClick={() => router.push(ROUTES.CHECKOUT)}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push(ROUTES.SHOP)}
                  className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust badges */}
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Free Shipping
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
