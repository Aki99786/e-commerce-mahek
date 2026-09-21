"use client";

import { useState, useEffect } from "react";
import { productService } from "@/features/products/services/product.service";
import type { Review } from "@/types/review";

const staticReviews = [
  {
    id: "1",
    customerName: "Ananya Singhania",
    customerInitial: "A",
    location: "London, UK",
    rating: 5,
    title: "Breathtaking craftsmanship",
    comment:
      "The zardozi craftsmanship on my wedding lehenga was beyond breathtaking. From virtual fittings in London to the seamless delivery, the attention to every detail made my trousseau utterly unforgettable.",
    date: "March 12, 2026",
    verified: true,
  },
  {
    id: "2",
    customerName: "Meera Roy-Kapoor",
    customerInitial: "M",
    location: "Dubai, UAE",
    rating: 5,
    title: "Felt like draped heritage",
    comment:
      "The antique gold Kanjeevaram drape felt like draped heritage. The custom blouse adjustments and cedar wood box packaging showed unparalleled attention to detail.",
    date: "February 4, 2026",
    verified: true,
  },
  {
    id: "3",
    customerName: "Rhea Merchant",
    customerInitial: "R",
    location: "New York, USA",
    rating: 5,
    title: "Effortless luxury from start to finish",
    comment:
      "Selecting our reception poshak through the digital concierge was effortless. The drape fell impeccably and received non-stop compliments all evening.",
    date: "January 22, 2026",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-[#C5A880]" : "text-[#E8E6E1]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(staticReviews);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await productService.getTestimonials();
        if (response && response.testimonials && response.testimonials.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedReviews: Review[] = (response.testimonials as any[]).map((t: any) => ({
            id: t._id || t.id || Math.random().toString(),
            customerName: t.userName || "Customer",
            customerInitial: t.userName ? t.userName.charAt(0).toUpperCase() : "C",
            location: t.location || "India",
            rating: t.rating || 5,
            title: t.title || "Great product",
            comment: t.comment || "",
            date: new Date(t.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            verified: t.isVerified ?? true,
          }));
          setReviews(mappedReviews.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const displayReviews = isLoading ? staticReviews : reviews.length > 0 ? reviews : staticReviews;

  return (
    <section className="bg-white py-12 md:py-16 border-t border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[9px] tracking-[0.25em] font-semibold text-[#6B6B6B] uppercase mb-3">
            Trousseau Stories
          </p>
          <h2
            className="text-3xl md:text-5xl font-semibold text-[#111212] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Client Acclaim
          </h2>
          <p className="text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
            Memorable moments from brides worldwide who trusted our atelier with their signature day.
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-[#E8E6E1] rounded-2xl p-7 flex flex-col gap-5 hover:shadow-lg hover:border-[#D0CCC6] transition-all duration-300"
            >
              {/* Stars */}
              <StarRating rating={review.rating} />

              {/* Quote */}
              <p className="text-sm text-[#444444] leading-relaxed flex-1 italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* View more */}
              <button className="self-start flex items-center gap-1.5 text-[10px] tracking-[0.15em] font-bold text-[#111212] uppercase border-b border-[#111212] hover:opacity-60 transition-opacity pb-px">
                VIEW MORE
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#F4F3F3]">
                <div className="w-9 h-9 rounded-full bg-[#111212] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
                    {review.customerInitial}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111212]">{review.customerName}</p>
                  <p className="text-[9px] text-[#9B9B9B]">{review.date}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[8px] tracking-[0.12em] text-[#6B6B6B] uppercase font-medium">
                    Verified Bride
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
