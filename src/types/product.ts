export enum ProductLabelType {
  SALE = "sale",
  PRE_ORDER = "pre-order",
  NEW = "new",
  SOLD_OUT = "sold-out",
}

export enum StockStatus {
  IN_STOCK = "in-stock",
  OUT_OF_STOCK = "out-of-stock",
  PRE_ORDER = "pre-order",
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductPrice {
  current?: number;
  original?: number;
  discount?: number;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductColor {
  name: string;
  image: string;
  available: boolean;
}

export interface ProductSize {
  name: string;
  available: boolean;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  brand?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images: ProductImage[];
  price: ProductPrice;
  rating?: ProductRating;
  category: string;
  categorySlug: string;
  label?: {
    type: ProductLabelType;
    text: string;
  };
  stockStatus: StockStatus;
  sku?: string;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  bestseller?: boolean;
  fabric?: string;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  features?: string[];
  washingInstructions?: {
    embroideredSuits?: string;
    printedCotton?: string;
    disclaimer?: string;
  };
  deliveryInfo?: {
    estimatedDate?: string;
    peopleViewing?: number;
  };
  reviews?: ProductReview[];
  is_sale?: boolean;
  is_wishlist?: boolean;
  is_cart_active?: boolean;
}

export interface ProductCardProps {
  product: Product;
  className?: string;
}
