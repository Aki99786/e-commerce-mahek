"use client";

import type { CheckoutState } from "../types/checkout.types";
import type { Address } from "../types/address.types";

const CHECKOUT_STATE_KEY = "mahek_checkout_state";

export function saveCheckoutState(state: CheckoutState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state));
}

export function loadCheckoutState(): CheckoutState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CHECKOUT_STATE_KEY);
    return stored ? (JSON.parse(stored) as CheckoutState) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STATE_KEY);
}

export function updateSelectedAddress(address: Address): void {
  const state = loadCheckoutState();
  if (!state) return;
  saveCheckoutState({ ...state, selectedAddress: address });
}
