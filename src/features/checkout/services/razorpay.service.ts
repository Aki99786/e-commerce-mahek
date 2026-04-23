import type {
  CheckoutOrderResponse,
  RazorpayPaymentResponse,
} from "../types/checkout.types";

export interface RazorpayLaunchOptions {
  orderData: CheckoutOrderResponse;
  onSuccess: (response: RazorpayPaymentResponse) => void;
  onDismiss: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function launchRazorpay(options: RazorpayLaunchOptions): void {
  const { orderData, onSuccess, onDismiss } = options;

  const razorpayOptions: Record<string, unknown> = {
    key: orderData.key_id,
    amount: orderData.amount,
    currency: orderData.currency,
    order_id: orderData.razorpayOrderId,
    name: "Mahek Sarees",
    description: "Order Payment",
    prefill: orderData.prefill,
    theme: {
      color: "#5f0d24",
    },
    modal: {
      ondismiss: onDismiss,
    },
    handler: (response: RazorpayPaymentResponse) => {
      onSuccess(response);
    },
  };

  const rzp = new window.Razorpay(razorpayOptions);
  rzp.open();
}
