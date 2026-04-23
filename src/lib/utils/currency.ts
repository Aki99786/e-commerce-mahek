import { SITE_CONFIG } from "@/constants/site";

export const formatPrice = (price: number): string => {
  return `${SITE_CONFIG.currencySymbol} ${price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const calculateDiscount = (
  originalPrice: number,
  currentPrice: number,
): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDiscount = (discount: number): string => {
  return `-${discount}%`;
};

export interface PriceBreakdown {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
}

export const calculatePriceBreakdown = (
  sellingPrice: number,
): PriceBreakdown => {
  const GST_RATE = 0.05;
  const basePrice = sellingPrice / (1 + GST_RATE);
  const gst = sellingPrice - basePrice;
  return {
    subtotal: Math.round(basePrice),
    gst: Math.round(gst),
    shipping: 0,
    total: sellingPrice,
  };
};
