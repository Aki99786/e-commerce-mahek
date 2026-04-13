export const ROUTES = {
  HOME: "/",
  SHOP: "/products",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/product/${id}`,
  CATEGORY: (slug: string) => `/products?category=${slug}`,
  SEARCH: (query: string) => `/products?search=${encodeURIComponent(query)}`,
  CART: "/cart",
  CHECKOUT: "/checkout/address",
  CHECKOUT_ADDRESS: "/checkout/address",
  CHECKOUT_PAYMENT: "/checkout/payment",
  CHECKOUT_SUCCESS: "/checkout/success",
  WISHLIST: "/wishlist",
  SALE: "/products",
  TRENDING: "/products",
  TRACK_ORDER: "/cart",
  ABOUT: "/about",
  HELP: "/help",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const CATEGORY_ROUTES = {
  SAREES: "/products?category=sarees",
  BANARASI_SAREES: "/products?category=banarasi-sarees",
  LEHENGA: "/products?category=lehenga",
  RAJPUTI_POSHAK: "/products?category=rajputi-poshak",
  BRIDAL_LEHENGA: "/products?category=bridal-lehenga",
} as const;
