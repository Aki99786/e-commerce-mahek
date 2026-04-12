export const ROUTES = {
  HOME: "/",
  SHOP: "/category/sarees",
  PRODUCT_DETAIL: (id: string) => `/product/${id}`,
  CATEGORY: (slug: string) => `/category/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout/address",
  CHECKOUT_ADDRESS: "/checkout/address",
  CHECKOUT_PAYMENT: "/checkout/payment",
  CHECKOUT_SUCCESS: "/checkout/success",
  WISHLIST: "/wishlist",
  SALE: "/category/sarees",
  TRENDING: "/category/sarees",
  TRACK_ORDER: "/cart",
  ABOUT: "/about",
  HELP: "/help",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const CATEGORY_ROUTES = {
  SAREES: "/category/sarees",
  BANARASI_SAREES: "/category/banarasi-sarees",
  LEHENGA: "/category/lehenga",
  RAJPUTI_POSHAK: "/category/rajputi-poshak",
  BRIDAL_LEHENGA: "/category/bridal-lehenga",
} as const;
