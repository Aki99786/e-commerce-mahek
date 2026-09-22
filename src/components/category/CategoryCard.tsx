import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { isVideoUrl } from "@/lib/utils/media";

export interface CategoryCardProps {
  name: string;
  image: string;
  video?: string;
  count?: string;
  href: string;
  className?: string;
}

export const CategoryCard = ({
  name,
  image,
  video,
  count,
  href,
  className,
}: CategoryCardProps) => {
  // Check if media is a video (either explicitly provided via video prop or file URL)
  const isVideo = Boolean(video || isVideoUrl(image));
  const videoSource = video || image;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col items-center justify-between p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 text-center w-full",
        className
      )}
    >
      {/* Aesthetic Gold Outer Ring + Media Frame */}
      <div className="relative p-1 sm:p-1.5 rounded-full border-[1.5px] border-[#dfb892] bg-[#fbf9f5] transition-all duration-500 group-hover:border-[#c59368] group-hover:scale-105 group-hover:shadow-md">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-stone-100">
          {isVideo ? (
            <video
              src={videoSource}
              poster={video ? image : undefined}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 110px, (max-width: 768px) 130px, 160px"
            />
          )}
        </div>
      </div>

      {/* Category Info */}
      <div className="mt-4 sm:mt-5 flex flex-col items-center">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-stone-900 group-hover:text-[#9f2c3d] transition-colors duration-200 leading-snug">
          {name}
        </h3>
        {count && (
          <p className="mt-1 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 group-hover:text-stone-500 transition-colors">
            {count}
          </p>
        )}
      </div>
    </Link>
  );
};

export const CategoryCircle = CategoryCard;
export default CategoryCard;
