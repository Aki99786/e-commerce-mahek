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
      <div className="flex-1 flex items-center justify-center">
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

      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-100 py-5 px-4 shadow-sm">
          <CheckoutStepper currentStep="payment" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 items-start">
            <div className="lg:col-span-2 space-y-4">

              {/* Step label */}
              <div>
                <p className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-rose-600 mb-1">Step 3 of 3</p>
                <h1 className="text-xl font-playfair font-bold text-gray-900">Payment</h1>
              </div>

              {/* Delivery address summary */}
              {selectedAddress && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={15} className="text-rose-500" />
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-gray-900 text-sm">
                          Delivering to <span className="text-rose-600">{selectedAddress.fullName}</span>
                        </p>
                        <p className="text-xs text-gray-500 font-poppins mt-0.5 leading-relaxed">
                          {selectedAddress.addressLine1}
                          {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}
                          , {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                        </p>
                        <p className="text-xs text-gray-500 font-poppins mt-0.5">
                          📞 {selectedAddress.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(ROUTES.CHECKOUT_ADDRESS)}
                      className="flex items-center gap-1.5 text-xs font-poppins font-semibold text-rose-600 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex-shrink-0"
                    >
                      <Pencil size={11} />
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Payment card */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Security badge */}
                <div className="flex items-center gap-2.5 px-5 py-3.5 bg-green-50 border-b border-green-100">
                  <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                  <p className="text-xs font-poppins text-green-700">
                    All payments are <span className="font-bold">100% secure</span> and encrypted via Razorpay
                  </p>
                </div>

                <div className="p-5">
                  {/* Razorpay option */}
                  <div className="border-2 border-rose-500 rounded-xl p-4 bg-rose-50/30 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins font-bold text-gray-900 text-sm">Pay via Razorpay</p>
                        <p className="text-xs font-poppins text-gray-400 mt-0.5">UPI · Cards · Net Banking · Wallets · EMI</p>
                      </div>
                      <span className="flex-shrink-0 text-[11px] font-bold font-poppins text-[#072654] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md tracking-tight">
                        rzp
                      </span>
                    </div>
                  </div>

                  {/* Accepted methods */}
                  <div className="mb-5">
                    <p className="text-[10px] font-poppins font-semibold uppercase tracking-widest text-gray-400 mb-2">Accepted Methods</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {["VISA", "Mastercard", "RuPay", "UPI", "Net Banking"].map((method) => (
                        <span
                          key={method}
                          className="text-[11px] font-poppins font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handlePayNow}
                    disabled={isProcessing || !razorpayReady}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3.5 rounded-xl font-poppins font-bold text-sm tracking-wider shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : !razorpayReady ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Loading Payment...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay ₹{checkoutState.total.toLocaleString()}
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 font-poppins text-center mt-3 leading-relaxed">
                    By placing the order, you agree to Mahek Sarees{" "}
                    <span className="underline cursor-pointer">Terms of Use</span> and{" "}
                    <span className="underline cursor-pointer">Privacy Policy</span>
                  </p>
                </div>
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
