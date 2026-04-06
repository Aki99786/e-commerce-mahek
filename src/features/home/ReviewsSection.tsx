"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ReviewCard } from "@/components/review/ReviewCard";
import { productService } from "@/features/products/services/product.service";
import type { Review } from "@/types/review";

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await productService.getTestimonials();
        if (response && response.testimonials) {
          const mappedReviews: Review[] = response.testimonials.map((t: any) => ({
            id: t._id || t.id || Math.random().toString(),
            customerName: t.userName || "Customer",
            customerInitial: t.userName ? t.userName.charAt(0).toUpperCase() : "C",
            location: t.location || "India",
            rating: t.rating || 5,
            title: t.title || "Great product",
            comment: t.comment || "",
            date: new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            verified: t.isVerified ?? true,
          }));
          setReviews(mappedReviews);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const slideReviewLeft = () => {
    if (reviewIndex > 0) {
      setReviewIndex(reviewIndex - 1);
    }
  };

  const slideReviewRight = () => {
    if (reviewIndex < reviews.length - 3) {
      setReviewIndex(reviewIndex + 1);
    }
  };

  return (
    <section className="py-10 md:py-14 lg:py-18 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-playfair tracking-tight">
            REVIEWS AND RATINGS
          </h2>
          <Link
            href="#"
            className="text-xs md:text-sm font-medium text-gray-700 hover:text-black transition-colors underline font-poppins"
          >
            View All
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={slideReviewLeft}
            disabled={reviewIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 hover:shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-gray-100"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={slideReviewRight}
            disabled={reviewIndex >= reviews.length - 3 || reviews.length <= 3}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 hover:shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-gray-100"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-4 md:gap-6 transition-all duration-500 py-4"
              style={{ transform: `translateX(-${reviewIndex * 33.33}%)` }}
            >
              {isLoading ? (
                <div className="flex w-full justify-center p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-md bg-gray-200 h-32 w-64"></div>
                    <div className="rounded-md bg-gray-200 h-32 w-64 hidden md:block"></div>
                    <div className="rounded-md bg-gray-200 h-32 w-64 hidden lg:block"></div>
                  </div>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]">
                    <ReviewCard review={review} />
                  </div>
                ))
              ) : (
                <div className="text-center w-full py-8 text-gray-500">No reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
