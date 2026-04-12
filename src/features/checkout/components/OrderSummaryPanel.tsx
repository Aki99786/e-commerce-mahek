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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-playfair font-bold text-gray-900 mb-4 uppercase tracking-wide">
        Price Details
      </h2>

      <div className="text-sm font-poppins text-gray-500 mb-3">
        {state.itemCount} {state.itemCount === 1 ? "Item" : "Items"}
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <div className="flex justify-between font-poppins text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">₹{breakdown.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-poppins text-sm">
          <span className="text-gray-600">GST (5%)</span>
          <span className="text-gray-800">₹{breakdown.gst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-poppins text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between font-poppins">
          <span className="text-base font-bold text-gray-900">Total Amount</span>
          <span className="text-base font-bold text-gray-900">
            ₹{state.total.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-poppins mt-1">
          Inclusive of all taxes
        </p>
      </div>

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
}
