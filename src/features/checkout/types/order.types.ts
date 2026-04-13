export enum OrderStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Order Placed",
  [OrderStatus.PROCESSING]: "Being Prepared",
  [OrderStatus.SHIPPED]: "Shipped",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Payment Pending",
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.FAILED]: "Payment Failed",
  [PaymentStatus.REFUNDED]: "Refunded",
};

export interface OrderProductVariant {
  color: string;
  sellingPrice: number;
  mrp: number;
  images: string[];
  sizeDetails: string;
  variantId: string;
  sizes: { size: string; stock: number }[];
}

export interface OrderItemProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  allImages: string[];
  variants: OrderProductVariant[];
}

export interface OrderItem {
  product: OrderItemProduct;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  awbCode: string | null;
  courierName: string | null;
  createdAt: string;
}

export interface MyOrdersResponse {
  orders: Order[];
}
