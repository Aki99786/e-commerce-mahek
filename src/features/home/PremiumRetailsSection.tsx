"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const PremiumRetailsSection = () => {
  return (
    <section className="py-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 font-poppins tracking-wide">
              You can&apos;t Miss !
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair leading-tight">
              Premium Retails Indian outfit corner
            </h2>
            <Link
              href={ROUTES.SALE}
              className="inline-flex items-center justify-center w-fit bg-black text-white px-6 py-2.5 rounded-full font-poppins font-semibold text-xs md:text-sm hover:bg-gray-800 transition-colors"
            >
              Shop Sale
            </Link>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-3 relative h-[350px] md:h-[420px] lg:h-[480px] rounded-lg overflow-hidden">
            <Image
              src="/images/rightsaleimg.png"
              alt="Premium Retails Indian outfit corner"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
