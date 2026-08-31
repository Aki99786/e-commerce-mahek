"use client";

import { ProductReview } from "@/types/product";

interface ReviewsSectionProps {
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

export const ReviewsSection = ({ reviews, averageRating, totalReviews }: ReviewsSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"
                } fill-current`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-700">
            Based on {reviews.length} reviews {totalReviews}
          </span>
        </div>

        <button className="bg-gray-900 text-white px-6 py-2.5 rounded font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Write a review
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">CUSTOMER REVIEWS</h3>

        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  } fill-current`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>

            <h4 className="text-base font-semibold text-gray-900 mb-1">
              {review.title}
            </h4>

            <p className="text-sm text-gray-600 mb-3">
              {review.author} on {review.date}
            </p>

            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
