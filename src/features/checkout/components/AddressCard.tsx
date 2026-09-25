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
      className={`relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-2 border-rose-500 bg-rose-50/40 shadow-sm"
          : "border border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm"
      }`}
    >
      {/* Selected accent bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-xl" />
      )}

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Radio */}
        <div className="mt-0.5 flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected ? "border-rose-500 bg-white" : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">
              {address.fullName}
            </span>
            {address.isDefault && (
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>

          {/* Address lines */}
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="text-xs text-gray-600">
                {address.city}, {address.state} — {address.pincode}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">{address.phone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons — only when selected */}
      {isSelected && (
        <div className="flex items-center gap-2 px-5 pb-3 pl-[2.75rem]">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(address._id); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-white border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
