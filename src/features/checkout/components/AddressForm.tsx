"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import type { Address, AddressFormData } from "../types/address.types";

interface AddressFormProps {
  initial?: Address;
  onSave: (data: AddressFormData) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const EMPTY_FORM: AddressFormData = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

interface FieldError {
  [key: string]: string;
}

function validate(data: AddressFormData): FieldError {
  const errors: FieldError = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.phone.trim() || !/^\d{10}$/.test(data.phone.trim()))
    errors.phone = "Valid 10-digit mobile number required";
  if (!data.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
  if (!data.city.trim()) errors.city = "City / District is required";
  if (!data.state.trim()) errors.state = "State is required";
  if (!data.pincode.trim() || !/^\d{6}$/.test(data.pincode.trim()))
    errors.pincode = "Valid 6-digit pin code required";
  return errors;
}

export function AddressForm({ initial, onSave, onCancel, isSaving }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>(
    initial
      ? {
          fullName: initial.fullName,
          phone: initial.phone,
          addressLine1: initial.addressLine1,
          addressLine2: initial.addressLine2 || "",
          city: initial.city,
          state: initial.state,
          pincode: initial.pincode,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FieldError>({});

  function handleChange(field: keyof AddressFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  }

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="font-semibold text-gray-900 text-base">
              {initial ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name*"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={inputClass}
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Mobile No*"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputClass}
              maxLength={10}
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Address
            </p>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Address Line 1 (House No, Building, Street)*"
                  value={form.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  className={inputClass}
                />
                <p className="text-xs text-amber-600 mt-1">
                  *House Number will allow a doorstep delivery
                </p>
                {errors.addressLine1 && (
                  <p className={errorClass}>{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Address Line 2 (Locality, Area, Colony)"
                  value={form.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="City / District*"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={inputClass}
                  />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State*"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className={inputClass}
                  />
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Pin Code*"
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className={inputClass}
                  maxLength={6}
                />
                {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5 sticky bottom-0 bg-white pt-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 bg-secondary text-white py-2.5 rounded font-semibold text-sm hover:bg-secondary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
