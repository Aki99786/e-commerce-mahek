import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const trustPillars = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "100% AUTHENTIC LUXE",
    sub: "Direct from Couture Guilds",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "COMPLIMENTARY PACKAGING",
    sub: "Signature Cedar Hardboxes",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "EXPRESS DELIVERY",
    sub: "Insured Worldwide Priority",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    title: "BESPOKE ALTERATION",
    sub: "Complimentary Master Fitting",
  },
];

export const HeroSection = () => {
  return (
    <section className="bg-[#F4F3F3] py-3 md:py-4 lg:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        {/* Main hero card */}
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#111212] flex flex-col lg:flex-row min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">

          {/* Left — Text content */}
          <div className="flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 lg:w-[48%] z-10">
            {/* Heritage badge */}
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 self-start">
              <span className="text-[9px] tracking-[0.3em] font-semibold text-white/50 uppercase">
                Heritage Edition
              </span>
              <div className="w-4 h-px bg-white/30" />
            </div>

            {/* Headline — Cormorant Garamond */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-4 md:mb-5 text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bright Look for{" "}
              <em className="not-italic" style={{ color: "#E8736B" }}>
                Special
              </em>{" "}
              Moments
            </h1>

            <p className="text-sm text-white/55 mb-8 leading-relaxed max-w-xs font-light">
              The Perfect Indian Collection — Designer Wear for Every Occasion
            </p>

            <Link
              href={ROUTES.SHOP}
              className="inline-flex items-center gap-3 self-start border border-white/30 text-white text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] font-semibold px-5 sm:px-7 py-3 sm:py-3.5 hover:bg-white hover:text-black transition-all duration-300"
            >
              SHOP THE COLLECTION
            </Link>

            {/* Bottom slide indicators */}
            <div className="flex items-center gap-2 mt-10">
              <div className="w-6 h-[2px] bg-white" />
              <div className="w-3 h-[2px] bg-white/30" />
              <div className="w-3 h-[2px] bg-white/30" />
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative lg:w-[52%] min-h-[280px] sm:min-h-[320px] lg:min-h-0">
            <Image
              src="/images/top-slider.png"
              alt="Heritage Edition — Bridal Couture"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
            {/* Gradient blend on left edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#111212] via-transparent to-transparent lg:via-[#111212]/10 pointer-events-none" />

            {/* Floating product tag — hidden on very small mobile */}
            <div className="hidden sm:flex absolute bottom-4 md:bottom-6 right-3 md:right-6 bg-[#111212]/90 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 md:p-3 items-center gap-2 md:gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                <Image
                  src="/images/top-slider.png"
                  alt="Royal Navy Blue Zari Saree"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="text-[8px] tracking-[0.15em] text-white/40 uppercase mb-0.5">Featured Style</p>
                <p className="text-xs font-medium text-white leading-tight">Royal Navy Blue</p>
                <p className="text-xs font-medium text-white leading-tight">Zari Saree</p>
                <p className="text-[11px] text-white/60 mt-0.5">₹92,000</p>
              </div>
              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center ml-1">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Corner label */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
              <p className="text-[8px] tracking-[0.25em] text-white/25 uppercase">
                Curated in New Delhi & Varanasi
              </p>
            </div>
          </div>
        </div>

        {/* 4-Pillar Trust Strip */}
        <div className="mt-2 md:mt-3 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E8E6E1] rounded-lg md:rounded-xl overflow-hidden border border-[#E8E6E1]">
          {trustPillars.map(({ icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-2 md:gap-3 bg-white px-3 md:px-5 py-3 md:py-4 hover:bg-[#FAF9F5] transition-colors"
            >
              <div className="text-[#111212] opacity-60 flex-shrink-0 hidden sm:block">{icon}</div>
              <div>
                <p className="text-[8px] md:text-[9px] tracking-[0.12em] md:tracking-[0.15em] font-semibold text-[#111212] uppercase leading-tight">
                  {title}
                </p>
                <p className="text-[9px] md:text-[10px] text-[#6B6B6B] mt-0.5 hidden sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
