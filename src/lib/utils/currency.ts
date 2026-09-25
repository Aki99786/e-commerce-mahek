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
