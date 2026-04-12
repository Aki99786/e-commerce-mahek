"use client";

import { Trash2, Pencil } from "lucide-react";
import type { Address } from "../types/address.types";

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div
      onClick={() => onSelect(address._id)}
      className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-secondary bg-secondary/5"
          : "border-gray-200 hover:border-gray-400 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected ? "border-secondary" : "border-gray-400"
            }`}
          >
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-poppins font-semibold text-gray-900 text-sm">
              {address.fullName}
            </span>
            {address.isDefault && (
              <span className="text-xs font-poppins bg-green-50 text-green-700 border border-green-300 px-2 py-0.5 rounded">
                Default
              </span>
            )}
          </div>

          <p className="text-sm font-poppins text-gray-600 leading-relaxed">
            {address.addressLine1}
          </p>
          {address.addressLine2 && (
            <p className="text-sm font-poppins text-gray-600">
              {address.addressLine2}
            </p>
          )}
          <p className="text-sm font-poppins text-gray-600">
            {address.city}, {address.state} — {address.pincode}
          </p>
          <p className="text-sm font-poppins text-gray-600 mt-1">
            Mobile: <span className="font-medium">{address.phone}</span>
          </p>
        </div>
      </div>

      {isSelected && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="flex items-center gap-1.5 text-sm font-poppins font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            <Pencil size={13} />
            EDIT
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address._id);
            }}
            className="flex items-center gap-1.5 text-sm font-poppins font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}
