"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Home, Truck } from "lucide-react";
import Link from "next/link";
import { clearCheckoutState } from "@/features/checkout/hooks/useCheckoutState";
import { ROUTES } from "@/constants/routes";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (!id) {
      router.push(ROUTES.HOME);
      return;
    }
    setOrderId(id);
    clearCheckoutState();
  }, [router, searchParams]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-green-500" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full animate-ping bg-green-200 opacity-30" />
          </div>
        </div>

        <h1 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-sm font-poppins text-gray-500 mb-6">
          Thank you for shopping with Mahek Sarees. Your order has been confirmed and payment received.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left space-y-2.5">
          <div className="flex justify-between font-poppins text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="text-gray-800 font-semibold text-xs break-all text-right ml-2 max-w-[55%]">
              {orderId}
            </span>
          </div>
          <div className="flex justify-between font-poppins text-sm">
            <span className="text-gray-500">Payment Status</span>
            <span className="text-green-600 font-semibold">Paid ✓</span>
          </div>
          <div className="flex justify-between font-poppins text-sm">
            <span className="text-gray-500">Order Status</span>
            <span className="text-gray-800 font-semibold">Processing</span>
          </div>
          <div className="flex justify-between font-poppins text-sm">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="text-gray-800 font-semibold">5–7 Working Days</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs font-poppins text-amber-700">
              Your order will be packed and shipped within 2–3 business days. You will receive a tracking number once shipped.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-blue-600 flex-shrink-0" />
            <p className="text-xs font-poppins text-blue-700">
              Shipping handled by Shiprocket. Track your order from My Orders page once dispatched.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={ROUTES.HOME}
            className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded font-poppins font-bold text-sm tracking-wider hover:bg-secondary/90 transition-colors"
          >
            <Home size={16} />
            Continue Shopping
          </Link>
          <Link
            href={ROUTES.HOME}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded font-poppins font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
