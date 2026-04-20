"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const PremiumRetailsSection = () => {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <p className="text-[10px] md:text-xs font-poppins font-semibold uppercase tracking-widest text-rose-600 mb-2">
              You can&apos;t Miss!
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 font-playfair leading-tight">
              Premium Retails Indian Outfit Corner
            </h2>
            <Link
              href={ROUTES.SALE}
              className="inline-flex items-center gap-2 w-fit bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-poppins font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Shop Sale
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
