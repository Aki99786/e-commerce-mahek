"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CheckoutStepper } from "@/features/checkout/components/CheckoutStepper";
import { AddressCard } from "@/features/checkout/components/AddressCard";
import { AddressForm } from "@/features/checkout/components/AddressForm";
import { OrderSummaryPanel } from "@/features/checkout/components/OrderSummaryPanel";
import { addressService } from "@/features/checkout/services/address.service";
import {
  loadCheckoutState,
  saveCheckoutState,
} from "@/features/checkout/hooks/useCheckoutState";
import type { Address, AddressFormData } from "@/features/checkout/types/address.types";
import type { CheckoutState } from "@/features/checkout/types/checkout.types";
import { cartService } from "@/features/cart/services/cart.service";
import { enrichCartItemsWithImages } from "@/features/cart/adapters/cart.adapter";
import { isAuthenticated } from "@/lib/auth-utils";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/lib/toast";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(ROUTES.LOGIN);
      return;
    }
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      const [cartResponse, allAddresses] = await Promise.all([
        (async () => {
          const savedState = loadCheckoutState();
          if (savedState && savedState.items.length > 0) return savedState;

          const cartRes = await cartService.getCartList();
          const enriched = await enrichCartItemsWithImages(cartRes.items || []);

          if (enriched.length === 0) {
            router.push(ROUTES.CART);
            return null;
          }

          const subtotal = enriched.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const itemCount = enriched.reduce((sum, item) => sum + item.quantity, 0);

          const state: CheckoutState = {
            items: enriched.map((item) => ({
              productId: item.product._id,
              productName: item.product.name,
              variantId: item.variantId,
              color: item.color,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              image: item.images?.[0] || item.product.allImages?.[0] || "",
            })),
            subtotal,
            shipping: 0,
            total: subtotal,
            selectedAddress: null,
            itemCount,
          };

          saveCheckoutState(state);
          return state;
        })(),
        addressService.getAddresses(),
      ]);

      if (cartResponse && typeof cartResponse === "object" && "items" in cartResponse) {
        setCheckoutState(cartResponse as CheckoutState);
        const state = cartResponse as CheckoutState;
        if (state.selectedAddress) {
          setSelectedId(state.selectedAddress._id);
        }
      } else if (cartResponse) {
        setCheckoutState(cartResponse as CheckoutState);
      }

      setAddresses(allAddresses);

      const defaultAddr =
        allAddresses.find((a) => a.isDefault) || allAddresses[0];
      if (defaultAddr) {
        setSelectedId((prev) => prev ?? defaultAddr._id);
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  }

  async function refreshAddresses() {
    try {
      const updated = await addressService.getAddresses();
      setAddresses(updated);
      return updated;
    } catch {
      return addresses;
    }
  }

  function handleSelect(id: string) {
    setSelectedId(id);
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    try {
      await addressService.deleteAddress(id);
      toast.success("Address deleted");
      const updated = await refreshAddresses();
      if (selectedId === id) {
        setSelectedId(updated[0]?._id || null);
      }
    } catch {
      toast.error("Failed to delete address");
    }
  }

  function handleAddNew() {
    setEditingAddress(undefined);
    setShowForm(true);
  }

  async function handleFormSave(data: AddressFormData) {
    setIsSaving(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, data);
        toast.success("Address updated");
      } else {
        const newAddr = await addressService.addAddress(data);
        toast.success("Address added");
        setSelectedId(newAddr._id);
      }
      await refreshAddresses();
      setShowForm(false);
      setEditingAddress(undefined);
    } catch {
      toast.error(editingAddress ? "Failed to update address" : "Failed to add address");
    } finally {
      setIsSaving(false);
    }
  }

  function handleContinue() {
    if (!selectedId) {
      toast.error("Please select a delivery address");
      return;
    }

    const selected = addresses.find((a) => a._id === selectedId);
    if (!selected || !checkoutState) return;

    saveCheckoutState({ ...checkoutState, selectedAddress: selected });
    router.push(ROUTES.CHECKOUT_PAYMENT);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <CheckoutStepper currentStep="address" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-xl font-playfair font-bold text-gray-900">
                Select Delivery Address
              </h1>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 text-sm font-poppins font-semibold text-secondary border border-secondary px-3 py-1.5 rounded hover:bg-secondary/5 transition-colors"
              >
                <Plus size={15} />
                ADD NEW ADDRESS
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 font-poppins text-sm mb-4">
                  No saved addresses found
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded font-poppins font-semibold text-sm hover:bg-secondary/90 transition-colors"
                >
                  <Plus size={15} />
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    isSelected={selectedId === address._id}
                    onSelect={handleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}

                <button
                  onClick={handleAddNew}
                  className="w-full border border-dashed border-secondary text-secondary py-3 rounded-lg font-poppins font-semibold text-sm hover:bg-secondary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={15} />
                  + Add New Address
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {checkoutState && (
              <OrderSummaryPanel
                state={checkoutState}
                actionButton={
                  <button
                    onClick={handleContinue}
                    disabled={!selectedId}
                    className="w-full bg-secondary text-white py-3 rounded font-poppins font-bold text-sm tracking-wider hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    CONTINUE
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <AddressForm
          initial={editingAddress}
          onSave={handleFormSave}
          isSaving={isSaving}
          onCancel={() => {
            if (isSaving) return;
            setShowForm(false);
            setEditingAddress(undefined);
          }}
        />
      )}
    </div>
  );
}
