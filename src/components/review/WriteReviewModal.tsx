"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Star, Camera, Loader2 } from "lucide-react";
import { ToastService } from "@/lib/toast";

const MAX_IMAGES = 4;
const FIELD_LABEL = "block text-xs font-semibold text-gray-700 mb-1";
const INPUT_BASE =
  "w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C1272D] focus:border-[#C1272D] disabled:bg-gray-50 disabled:opacity-60 transition-all";

export interface ReviewSubmissionData {
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  files?: File[];
}

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewSubmissionData) => Promise<void> | void;
  isSubmitting?: boolean;
}

const INITIAL_FORM = { rating: 5, title: "", comment: "" };

export const WriteReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting: externalSubmitting,
}: WriteReviewModalProps) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [internalSubmitting, setInternalSubmitting] = useState(false);

  const isSubmitting = externalSubmitting ?? internalSubmitting;

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
  }, [imagePreviews]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }, [isSubmitting, resetForm, onClose]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - imagePreviews.length;
    if (availableSlots <= 0) return;

    const filesToAdd = selected.slice(0, availableSlots);
    const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...filesToAdd]);
    setImagePreviews((prev) => [...prev, ...newUrls]);
    e.target.value = ""; // Reset input so same file can be re-selected if needed
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, comment, rating } = formData;

    if (!title.trim() || !comment.trim()) {
      ToastService.error("Please fill in the headline and review text.");
      return;
    }

    setInternalSubmitting(true);
    try {
      await onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images: imagePreviews.length > 0 ? [...imagePreviews] : undefined,
        files: imageFiles.length > 0 ? [...imageFiles] : undefined,
      });

      ToastService.success("Thank you! Your review has been submitted.");
      resetForm();
      onClose();
    } catch {
      ToastService.error("Failed to submit review. Please try again.");
    } finally {
      setInternalSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop with click to close */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Write a Review
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Share your thoughts and feedback with other buyers
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className={FIELD_LABEL}>Overall Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-gray-700 ml-2">
                {formData.rating} / 5
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={FIELD_LABEL}>Headline / Title</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Amazing Product, Great Quality"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={INPUT_BASE}
            />
          </div>

          {/* Detailed Review */}
          <div>
            <label className={FIELD_LABEL}>Detailed Review</label>
            <textarea
              required
              rows={3}
              disabled={isSubmitting}
              placeholder="Write your review here regarding fabric, fit, and comfort..."
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className={`${INPUT_BASE} resize-none`}
            />
          </div>

          {/* Image Upload Option */}
          <div>
            <label className={FIELD_LABEL}>Add Photos (Optional)</label>

            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2.5">
                {imagePreviews.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Review preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition cursor-pointer disabled:opacity-50"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length < MAX_IMAGES && (
              <label
                className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#C1272D] rounded-xl py-3 px-4 text-xs font-medium text-gray-600 hover:text-[#C1272D] transition-colors ${
                  isSubmitting ? "opacity-50 pointer-events-none" : "cursor-pointer"
                }`}
              >
                <Camera className="w-4 h-4 text-[#C1272D]" />
                <span>
                  Upload photos ({imagePreviews.length}/{MAX_IMAGES})
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isSubmitting}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#C1272D] hover:bg-[#a81f25] disabled:opacity-70 text-white font-semibold text-sm transition-all shadow-md shadow-red-900/20 mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Review...</span>
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
