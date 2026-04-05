export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL as string,
} as const;

export const API_ENDPOINTS = {
  CART: {
    ADD: "cart/add",
    UPDATE: "cart/update",
    REMOVE: "cart/remove",
    LIST: "cart/list",
    CLEAR: "cart/clear",
  },
  WISHLIST: {
    LIST: "wishlist/list",
    ADD: "wishlist/add",
    REMOVE: "wishlist/remove",
    MOVE_TO_CART: "wishlist/move-to-cart",
    BULK_MOVE_TO_CART: "wishlist/bulk-move-to-cart",
  },
  PRODUCTS: {
    LIST: "products/list",
    BY_ID: (id: string) => `products/${id}`,
    BEST_SELLING: "products/best-selling-temp",
    TRENDING: "products/trending-temp",
  },
  AUTH: {
    SEND_OTP: "auth/send-otp",
    VERIFY_OTP: "auth/verify-otp",
  },
  REVIEWS: {
    ADD: (productId: string) => `products/${productId}/reviews`,
    UPDATE: (productId: string, reviewId: string) =>
      `products/${productId}/reviews/${reviewId}`,
    DELETE: (productId: string, reviewId: string) =>
      `products/${productId}/reviews/${reviewId}`,
  },
} as const;
