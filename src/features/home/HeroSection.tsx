"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { CategoryEnum } from "@/constants/categories";
import { cn } from "@/lib/utils/cn";

type HeroSlide = {
  id: number;
  image: string;
  objectPosition: string;
  category: CategoryEnum;
  badge: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  subtitle: string;
  cta: string;
};

const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 1,
    image: "/images/top-slider.png",
    objectPosition: "72% top",
    category: CategoryEnum.BRIDAL_LEHENGA,
    badge: "Heritage Edition",
    titleBefore: "Bright Look for",
    titleAccent: "Special",
    titleAfter: "Moments",
    subtitle: "The Perfect Indian Collection — Designer Wear for Every Occasion",
    cta: "SHOP THE COLLECTION",
  },
  {
    id: 2,
    image: "/images/top-slider.png",
    objectPosition: "38% top",
    category: CategoryEnum.LEHENGA,
    badge: "Festive Couture",
    titleBefore: "Celebrate in",
    titleAccent: "Timeless",
    titleAfter: "Silhouettes",
    subtitle: "Hand-embroidered lehengas crafted for weddings, festivals, and royal evenings",
    cta: "EXPLORE LEHENGAS",
  },
  {
    id: 3,
    image: "/images/top-slider.png",
    objectPosition: "12% top",
    category: CategoryEnum.SAREES,
    badge: "Silk Atelier",
    titleBefore: "Drape the",
    titleAccent: "Heritage",
    titleAfter: "Weave",
    subtitle: "Pure silk drapes and ancestral zari — curated in New Delhi & Varanasi",
    cta: "EXPLORE SILK SAREES",
  },
  {
    id: 4,
    image: "/images/top-slider.png",
    objectPosition: "95% top",
    category: CategoryEnum.BANARASI_SAREES,
    badge: "Banarasi Edit",
    titleBefore: "Royal Glow for",
    titleAccent: "Eternal",
    titleAfter: "Occasions",
    subtitle: "Banarasi masterweaves finished with luminous borders and heirloom detail",
    cta: "EXPLORE BANARASI",
  },
] as const;

const AUTO_PLAY_INTERVAL_MS = 5000;

const trustPillars = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "100% AUTHENTIC LUXE",
    sub: "Direct from Couture Guilds",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    title: "COMPLIMENTARY PACKAGING",
    sub: "Signature Cedar Hardboxes",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "EXPRESS DELIVERY",
    sub: "Insured Worldwide Priority",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
        />
      </svg>
    ),
    title: "BESPOKE ALTERATION",
    sub: "Complimentary Master Fitting",
  },
];

export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimerKey((key) => key + 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, timerKey]);

  return (
    <section className="bg-[#F4F3F3] py-3 md:py-4 lg:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8 lg:px-16">
        {/* Main hero card — compact height vs Figma */}
        <div
          className="relative flex min-h-[340px] flex-col overflow-hidden rounded-xl bg-[#111212] sm:min-h-[380px] md:rounded-2xl lg:min-h-[420px] lg:flex-row"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left — Text content */}
          <div className="relative z-10 flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:w-[48%] lg:px-12 lg:py-12">
            <div className="mb-3 inline-flex items-center gap-2 self-start md:mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-opacity duration-500">
                {activeSlide.badge}
              </span>
              <div className="h-px w-4 bg-white/30" />
            </div>

            <h1
              key={`title-${activeSlide.id}`}
              className="mb-3 text-[28px] font-semibold leading-[1.08] text-white transition-opacity duration-500 sm:text-4xl md:mb-4 md:text-5xl lg:text-[52px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeSlide.titleBefore}{" "}
              <em className="not-italic" style={{ color: "#E8736B" }}>
                {activeSlide.titleAccent}
              </em>{" "}
              {activeSlide.titleAfter}
            </h1>

            <p
              key={`sub-${activeSlide.id}`}
              className="mb-6 max-w-xs text-sm font-light leading-relaxed text-white/55 transition-opacity duration-500 md:mb-7"
            >
              {activeSlide.subtitle}
            </p>

            <Link
              href={ROUTES.CATEGORY(activeSlide.category)}
              className="inline-flex items-center gap-3 self-start border border-white/30 px-5 py-3 text-[10px] font-semibold tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-black sm:px-7 sm:py-3 sm:text-[11px] sm:tracking-[0.2em]"
            >
              {activeSlide.cta}
            </Link>

            {/* Slide indicators */}
            <div className="mt-8 flex items-center gap-2 md:mt-9">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-[2px] transition-all duration-500",
                    index === activeIndex ? "w-6 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right — Image slider (no side cards) */}
          <div className="relative min-h-[220px] sm:min-h-[260px] lg:w-[52%] lg:min-h-0">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={slide.image}
                  alt={`${slide.titleBefore} ${slide.titleAccent} ${slide.titleAfter}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
              </div>
            ))}

            {/* Gradient blend on left edge */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111212] via-transparent to-transparent lg:via-[#111212]/10" />

            {/* Bottom-right arrow — next slide */}
            <button
              type="button"
              aria-label="Next slide"
              onClick={goToNext}
              className="absolute bottom-4 right-4 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-[#111212]/80 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white hover:text-black sm:bottom-5 sm:right-5 sm:size-11 md:bottom-6 md:right-6"
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="pointer-events-none absolute bottom-5 left-0 right-14 flex justify-center sm:bottom-6">
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                Curated in New Delhi &amp; Varanasi
              </p>
            </div>
          </div>
        </div>

        {/* 4-Pillar Trust Strip */}
        <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#E8E6E1] bg-[#E8E6E1] md:mt-3 md:rounded-xl lg:grid-cols-4">
          {trustPillars.map(({ icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-2 bg-white px-3 py-3 transition-colors hover:bg-[#FAF9F5] md:gap-3 md:px-5 md:py-4"
            >
              <div className="hidden shrink-0 text-[#111212] opacity-60 sm:block">{icon}</div>
              <div>
                <p className="text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#111212] md:text-[9px] md:tracking-[0.15em]">
                  {title}
                </p>
                <p className="mt-0.5 hidden text-[9px] text-[#6B6B6B] sm:block md:text-[10px]">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
