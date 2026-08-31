import { Review } from "@/types/review";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils/cn";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export const ReviewCard = ({ review, className }: ReviewCardProps) => {
  return (
    <div className={cn("bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg md:text-xl font-bold">{review.customerInitial}</span>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">{review.customerName}</h3>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">{review.location}</p>
          </div>
        </div>

        <Rating rating={review.rating} className="flex-shrink-0" />
      </div>

      <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">{review.title}</h4>

      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">{review.comment}</p>

      <p className="text-gray-400 text-[10px] md:text-xs">{review.date}</p>
    </div>
  );
};
