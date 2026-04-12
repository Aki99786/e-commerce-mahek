"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { MapPin, ShieldCheck, Pencil } from "lucide-react";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { OrderSummaryPanel } from "@/features/checkout/components/OrderSummaryPanel";
import { loadCheckoutState } from "@/features/checkout/hooks/useCheckoutState";
import { launchRazorpay } from "@/features/checkout/services/razorpay.service";
import { orderService } from "@/features/checkout/services/order.service";
import type { CheckoutState } from "@/features/checkout/types/checkout.types";
import { isAuthenticated } from "@/lib/auth-utils";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/lib/toast";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const state = loadCheckoutState();
    if (!state || state.items.length === 0) {
      router.push(ROUTES.CART);
      return;
    }
    if (!state.selectedAddress) {
      router.push(ROUTES.CHECKOUT_ADDRESS);
      return;
    }
    setCheckoutState(state);
    setLoading(false);
  }, [router]);

  async function handlePayNow() {
    if (!checkoutState?.selectedAddress || !razorpayReady) return;

    setIsProcessing(true);

    try {
      const orderData = await orderService.createCheckoutOrder(
        checkoutState.selectedAddress._id,
      );

      launchRazorpay({
        orderData,
        onSuccess: async (razorpayResponse) => {
          try {
            const verifyResult = await orderService.verifyPayment({
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
              addressId: checkoutState.selectedAddress!._id,
            });

            router.push(
              `${ROUTES.CHECKOUT_SUCCESS}?orderId=${verifyResult.order._id}`,
            );
          } catch {
            setIsProcessing(false);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled. You can retry anytime.");
        },
      });
    } catch {
      setIsProcessing(false);
      toast.error("Failed to initiate payment. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    );
  }

  if (!checkoutState) return null;

  const { selectedAddress } = checkoutState;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setRazorpayReady(true)}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-background-light">
        <div className="bg-white border-b border-gray-200 py-4 px-4">
          <CheckoutStepper currentStep="payment" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {selectedAddress && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-poppins font-semibold text-gray-900 text-sm mb-0.5">
                          Delivering to:{" "}
                          <span className="text-gray-700 font-medium">
                            {selectedAddress.fullName}, {selectedAddress.pincode}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 font-poppins">
                          {selectedAddress.addressLine1}
                          {selectedAddress.addressLine2
                            ? `, ${selectedAddress.addressLine2}`
                            : ""}
                          , {selectedAddress.city}, {selectedAddress.state}
                        </p>
                        <p className="text-sm text-gray-500 font-poppins mt-0.5">
                          Mobile: {selectedAddress.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(ROUTES.CHECKOUT_ADDRESS)}
                      className="flex items-center gap-1 text-xs font-poppins font-semibold text-secondary border border-secondary px-2.5 py-1.5 rounded hover:bg-secondary/5 transition-colors flex-shrink-0 ml-3"
                    >
                      <Pencil size={12} />
                      CHANGE
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="font-playfair font-bold text-gray-900 text-lg mb-5">
                  Payment
                </h2>

                <div className="flex items-center gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg mb-5">
                  <ShieldCheck size={20} className="text-secondary flex-shrink-0" />
                  <p className="text-sm font-poppins text-gray-700">
                    All payments are{" "}
                    <span className="font-semibold">100% secure</span> and encrypted
                    via Razorpay
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-gray-900 text-sm">
                        Pay via Razorpay
                      </p>
                      <p className="text-xs font-poppins text-gray-500 mt-0.5">
                        UPI · Cards · Net Banking · Wallets · EMI
                      </p>
                    </div>
                    <img
                      src="https://razorpay.com/assets/razorpay-logo.svg"
                      alt="Razorpay"
                      className="h-5 ml-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {["VISA", "Mastercard", "RuPay", "UPI", "Net Banking"].map(
                    (method) => (
                      <span
                        key={method}
                        className="text-xs font-poppins text-gray-500 border border-gray-200 px-2 py-1 rounded"
                      >
                        {method}
                      </span>
                    ),
                  )}
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={isProcessing || !razorpayReady}
                  className="w-full bg-secondary text-white py-3.5 rounded font-poppins font-bold text-sm tracking-wider hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : !razorpayReady ? (
                    "Loading Payment..."
                  ) : (
                    `PAY ₹${checkoutState.total.toLocaleString()}`
                  )}
                </button>

                <p className="text-xs text-gray-400 font-poppins text-center mt-3">
                  By placing the order, you agree to Mahek Sarees Terms of Use and
                  Privacy Policy
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummaryPanel state={checkoutState} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
