import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface CategoryCircleProps {
  name: string;
  image: string;
  href: string;
  className?: string;
}

export const CategoryCircle = ({
  name,
  image,
  href,
  className,
}: CategoryCircleProps) => {
  return (
    <div className={cn("flex flex-col items-center cursor-pointer group", className)}>
      <Link href={href} className="flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-rose-400 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-rose-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
          />
        </div>
        <p className="mt-2 sm:mt-3 md:mt-4 text-center text-xs md:text-sm font-medium text-gray-700 group-hover:text-rose-700 transition-colors duration-200">
          {name}
        </p>
      </Link>
    </div>
  );
};
