"use client";

import { useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export interface CartConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  confirmTextColor?: string;
  isLoading?: boolean;
}

export function CartConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "CANCEL",
  confirmTextColor = "text-[#ff3e6c]",
  isLoading = false,
}: CartConfirmationModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && onClose()}
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity animate-in fade-in duration-150"
      />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 border border-gray-200/80"
      >
        {/* Top Header & Content Area */}
        <div className="p-5 sm:p-6 pb-6">
          <div className="flex items-start justify-between gap-3">
            <h2
              id="confirm-modal-title"
              className="text-[17px] sm:text-[18px] font-bold text-[#282c3f] tracking-tight leading-snug"
            >
              {title}
            </h2>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close dialog"
              className="p-1 -mr-1 -mt-1 text-[#282c3f] hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <p className="text-[14px] sm:text-[15px] text-[#535766] font-normal mt-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#eaeaec]" />

        {/* Bottom Actions Row (Split 50% / 50% with vertical divider) */}
        <div className="flex items-stretch divide-x divide-[#eaeaec] min-h-[48px] sm:min-h-[50px]">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 text-center text-xs sm:text-[13px] font-bold tracking-wider uppercase text-[#535766] hover:text-[#282c3f] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer select-none disabled:opacity-40"
          >
            {cancelText}
          </button>

          {/* Confirm Action Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3.5 px-4 text-center text-xs sm:text-[13px] font-bold tracking-wider uppercase ${confirmTextColor} hover:bg-rose-50/40 active:bg-rose-100/50 transition-colors cursor-pointer select-none disabled:opacity-40 flex items-center justify-center gap-1.5`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#ff3e6c]" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
