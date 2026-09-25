"use client";

import { calculatePriceBreakdown } from "@/lib/utils/currency";
import type { CheckoutState } from "../types/checkout.types";

interface OrderSummaryPanelProps {
  state: CheckoutState;
  actionButton?: React.ReactNode;
}

export function OrderSummaryPanel({ state, actionButton }: OrderSummaryPanelProps) {
  const breakdown = calculatePriceBreakdown(state.total);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a0a0a] to-[#3d1515] px-5 py-4">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Price Details
        </h2>
        <p className="text-[11px] text-white/50 mt-0.5">
          {state.itemCount} {state.itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Breakdown */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-900">₹{breakdown.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">GST (5%)</span>
          <span className="font-semibold text-gray-900">₹{breakdown.gst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="font-semibold text-green-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            FREE
          </span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-900 text-sm">Total Amount</span>
          <div className="text-right">
            <span className="font-bold text-base text-gray-900">₹{state.total.toLocaleString()}</span>
            <p className="text-[10px] text-gray-400">Incl. all taxes</p>
          </div>
        </div>
      </div>

      {/* Action button */}
      {actionButton && <div className="px-5 pb-4">{actionButton}</div>}

      {/* Trust strip */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure Checkout
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Free Delivery
        </div>
      </div>
    </div>
  );
}
