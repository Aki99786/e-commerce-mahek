import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[480px] sm:h-[520px] md:h-[560px] lg:h-[620px] overflow-hidden">
      <Image
        src="/images/top-slider.png"
        alt="Bright Look for Special Moments"
        fill
        priority
        className="object-cover object-center scale-[1.02]"
        sizes="100vw"
      />
      {/* Layered overlay: dark base + left-side gradient for text legibility */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      <div className="relative h-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-full flex items-center">
          <div className="max-w-lg w-full">
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <p className="text-white text-[10px] md:text-xs tracking-[0.18em] font-poppins font-medium uppercase">
                Celebrate in Style
              </p>
            </div>

            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 font-playfair drop-shadow-md">
              Bright Look for<br />
              <span className="text-rose-300">Special</span> Moments
            </h1>

            <p className="text-white/80 text-sm md:text-base mb-7 font-poppins font-light leading-relaxed max-w-sm">
              The Perfect Indian Collection — Designer Wear for Every Occasion
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={ROUTES.SHOP}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 font-poppins rounded-xl shadow-lg hover:shadow-rose-500/30"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={ROUTES.TRENDING}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-200 font-poppins rounded-xl"
              >
                Trending Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
        <div className="w-5 h-8 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
