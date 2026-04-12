import type { Address } from "./address.types";

export interface CheckoutCartItem {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CheckoutState {
  items: CheckoutCartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  selectedAddress: Address | null;
  itemCount: number;
}

export interface RazorpayPrefill {
  name: string;
  email: string;
  contact: string;
}

export interface CheckoutOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key_id: string;
  prefill: RazorpayPrefill;
  shippingAddress: Record<string, unknown>;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  addressId: string;
}

export interface PlacedOrder {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  awbCode: string | null;
  courierName: string | null;
  createdAt: string;
}

export interface VerifyPaymentResponse {
  message: string;
  order: PlacedOrder;
}
