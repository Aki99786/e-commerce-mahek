"use client";

import Image from "next/image";
import Link from "next/link";

const reels = [
  {
    id: 1,
    designer: "SABYASACHI",
    title: "Hand-Embroidered Silk Lehenga",
    sub: "Reel: Bridal Veil Trails",
    views: "84.2K Views",
    image: "/images/cate1.png",
  },
  {
    id: 2,
    designer: "MANISH MALHOTRA",
    title: "Emerald Kanjeevaram Saree",
    sub: "Reel: Saree Draping Masterclass",
    views: "120K Views",
    image: "/images/cate2.png",
  },
  {
    id: 3,
    designer: "ANITA DONGRE",
    title: "Fuchsia Gul-Bagh Lehenga",
    sub: "Reel: Festive Twirls & Flore",
    views: "65.8K Views",
    image: "/images/cate3.png",
  },
  {
    id: 4,
    designer: "TARUN TAHILIANI",
    title: "Royal Navy Blue Zari Saree",
    sub: "Reel: Royal Navy Pallu Flow",
    views: "95.4K Views",
    image: "/images/cate4.png",
  },
];

export const CollectionReelsSection = () => {
  return (
    <section className="bg-white py-8 md:py-14 border-t border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-5 md:mb-7">
          <div>
            <p className="text-[9px] tracking-[0.25em] font-semibold text-[#6B6B6B] uppercase mb-1.5">
              Social Runway
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#111212] leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Our Collection Reels
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full border border-[#E8E6E1] flex items-center justify-center text-[#111212] hover:bg-[#111212] hover:text-white hover:border-[#111212] transition-all"
              aria-label="Previous"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full border border-[#E8E6E1] flex items-center justify-center text-[#111212] hover:bg-[#111212] hover:text-white hover:border-[#111212] transition-all"
              aria-label="Next"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative group rounded-xl overflow-hidden bg-[#111212] cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={reel.image}
                alt={reel.title}
                fill
                className="object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Top badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span className="text-[9px] text-white/80 tracking-wide font-medium">Atelier Audio</span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="text-[9px] text-white/80 tracking-wide font-medium">{reel.views}</span>
                </div>
              </div>

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:bg-black/50 transition-colors">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <p className="text-[8px] tracking-[0.2em] text-white/50 uppercase font-medium mb-1">
                  {reel.designer}
                </p>
                <p className="text-sm font-semibold text-white leading-tight mb-0.5">{reel.title}</p>
                <p className="text-[9px] text-white/50 mb-3">{reel.sub}</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] font-bold text-white uppercase border-b border-white/30 hover:border-white transition-colors pb-px"
                >
                  SHOP LOOK
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
