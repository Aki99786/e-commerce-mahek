export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL as string,
} as const;

export const API_ENDPOINTS = {
  CART: {
    ADD: "cart/add",
    UPDATE: (id: string) => `cart/update/${id}`,
    REMOVE: "cart/remove",
    LIST: "cart/list",
    CLEAR: "cart/clear",
  },
  WISHLIST: {
    LIST: "wishlist/list",
    ADD: "wishlist/add",
    REMOVE: (id: string) => `wishlist/remove/${id}`,
    MOVE_TO_CART: "wishlist/move-to-cart",
    BULK_MOVE_TO_CART: "wishlist/bulk-move-to-cart",
  },
  PRODUCTS: {
    LIST: "products/list",
    FILTER_OPTIONS: "products/get-filter-options",
    BY_ID: (id: string) => `products/${id}`,
    BEST_SELLING: "products/best-selling",
    TRENDING: "products/trending",
    FLASH_SALE: "products/flash-sale",
    LEHENGAS: "products/lehengas",
    TESTIMONIALS: "products/testimonials",
  },
  AUTH: {
    SEND_OTP: "auth/send-otp",
    VERIFY_OTP: "auth/verify-otp",
    LOGIN: "auth/login",
  },
  ADDRESS: {
    LIST: "auth/addresses",
    ADD: "auth/addresses",
    UPDATE: (id: string) => `auth/addresses/${id}`,
    DELETE: (id: string) => `auth/addresses/${id}`,
  },
  ORDERS: {
    CHECKOUT: "orders/checkout",
    VERIFY_PAYMENT: "orders/verify-payment",
    MY_ORDERS: "orders/my-orders",
  },
  REVIEWS: {
    ADD: (productId: string) => `products/${productId}/reviews`,
    UPDATE: (productId: string, reviewId: string) =>
      `products/${productId}/reviews/${reviewId}`,
    DELETE: (productId: string, reviewId: string) =>
      `products/${productId}/reviews/${reviewId}`,
  },
} as const;
