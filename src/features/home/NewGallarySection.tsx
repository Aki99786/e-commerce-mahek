"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { CategoryEnum } from "@/constants/categories";
import { cn } from "@/lib/utils/cn";

type GalleryItem = {
  id: number;
  num: string;
  tag: string;
  title: string;
  sub: string;
  category: CategoryEnum;
  image: string;
  thumbImage?: string;
  eyebrow: string;
  featuredTitle: string;
  description: string;
  cta: string;
};

const GALLERY_ITEMS: readonly GalleryItem[] = [
  {
    id: 1,
    num: "01",
    tag: "HEIRLOOM ARTISTRY",
    title: "Bridal Lehengas",
    sub: "Heritage Edition 2026",
    category: CategoryEnum.BRIDAL_LEHENGA,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/5595eae9-45fd-43d7-a338-7995c1bc442c.png",
    eyebrow: "ATELIER BRIDAL COUTURE",
    featuredTitle: "Imperial Bridal Lehengas",
    description:
      "Architectural silhouettes hand-embroidered in pure zari and resham. Heirloom bridal ensembles crafted for the modern sovereign bride.",
    cta: "EXPLORE BRIDAL LEHENGAS",
  },
  {
    id: 2,
    num: "02",
    tag: "HERITAGE ZARI",
    title: "Silk Sarees",
    sub: "Heritage Edition 2026",
    category: CategoryEnum.SAREES,
    image: " https://storage.googleapis.com/mahek_saree_staging/products/511c494b-5d95-404c-89bf-76172999893e.png",
    thumbImage: " https://storage.googleapis.com/mahek_saree_staging/products/511c494b-5d95-404c-89bf-76172999893e.png",
    eyebrow: "PURE CRAFT MASTERY",
    featuredTitle: "Banarasi & Kanjeevaram",
    description:
      "Pure mulberry and katan silks woven with real silver-gilt zari. Masterclass drapes celebrating centuries of Banaras and Kanchipuram weaving guilds.",
    cta: "EXPLORE SILK SAREES",
  },
  {
    id: 3,
    num: "03",
    tag: "ROYAL RESHAM",
    title: "Rajputi Poshak",
    sub: "Heritage Edition 2026",
    category: CategoryEnum.RAJPUTI_POSHAK,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/f87ac66d-9f7b-4668-88de-c82f7064738b.png",
    eyebrow: "ROYAL RAJASTHANI WEAVES",
    featuredTitle: "Rajputi Poshak Atelier",
    description:
      "Regal poshak ensembles in pure silk and resham, echoing the courts of Rajasthan. Timeless drapes for ceremonial grace and everyday grandeur.",
    cta: "EXPLORE RAJPUTI POSHAK",
  },
  {
    id: 4,
    num: "04",
    tag: "VIBRANT EMBROIDERIES",
    title: "Festive Lehengas",
    sub: "Heritage Edition 2026",
    category: CategoryEnum.LEHENGA,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/5595eae9-45fd-43d7-a338-7995c1bc442c.png",
    eyebrow: "FESTIVE COUTURE EDIT",
    featuredTitle: "Festive Lehengas",
    description:
      "Vibrant embroideries and luminous silhouettes for celebrations. Handcrafted festive lehengas that move with colour, light, and occasion.",
    cta: "EXPLORE FESTIVE LEHENGAS",
  },
  {
    id: 5,
    num: "05",
    tag: "PURE KATAN SILK",
    title: "Banarasi Sarees",
    sub: "Heritage Edition 2026",
    category: CategoryEnum.BANARASI_SAREES,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/39302121-d1e1-4376-9ddf-ecee89f1959b.png",
    thumbImage: "https://storage.googleapis.com/mahek_saree_staging/products/39302121-d1e1-4376-9ddf-ecee89f1959b.png",
    eyebrow: "KATAN SILK HERITAGE",
    featuredTitle: "Royal Silk Drapes",
    description:
      "Pure katan silk draped in ancestral Banarasi techniques. Limited weaves finished with heirloom borders and luminous zari detail.",
    cta: "EXPLORE BANARASI SAREES",
  },
] as const;

const DEFAULT_ACTIVE_INDEX = 1;
const AUTO_PLAY_INTERVAL_MS = 4000;

export const NewGallarySection = () => {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_INDEX);
  const [isPaused, setIsPaused] = useState(false);
  const activeItem = GALLERY_ITEMS[activeIndex] ?? GALLERY_ITEMS[DEFAULT_ACTIVE_INDEX];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="bg-[#f9f9f9] px-4 py-10 sm:px-6 md:px-10 md:py-14 lg:p-16">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 md:gap-10">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-[rgba(196,199,199,0.3)] pb-6 md:pb-[25px]">
          <div className="flex flex-col gap-2">
            <h2
              className="text-[32px] font-semibold uppercase leading-[1.15] tracking-[-0.8px] text-black sm:text-[40px] md:text-[46px] md:leading-[52px] md:tracking-[-1.15px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              DISCOVER
            </h2>
            <p className="max-w-[576px] text-sm leading-6 text-[#444748] md:text-base">
              Handcrafted heirloom textiles, architectural silhouettes, and ancestral Indian
              craftsmanship reimagined for the modern sovereign bride.
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="hidden items-center gap-2 py-1 transition-opacity hover:opacity-60 md:inline-flex"
          >
            <span className="relative py-0.5 text-[11px] font-semibold uppercase tracking-[1.1px] text-black">
              VIEW PRODUCTS
              <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
            </span>
            <Image
              src="/images/new-gallery/arrow-right.svg"
              alt=""
              width={10}
              height={10}
              className="size-[9.6px]"
            />
          </Link>
        </div>

        {/* Gallery grid — featured left, cards right (Figma) */}
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setIsPaused(false);
            }
          }}
        >
          {/* Featured panel */}
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[rgba(196,199,199,0.3)] bg-[#111212] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:min-h-[520px] lg:col-span-7 lg:min-h-[660px]">
            {GALLERY_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={item.image}
                  alt={item.featuredTitle}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={index === DEFAULT_ACTIVE_INDEX}
                />
              </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

            <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end">
              <div className="flex flex-col gap-1 p-5 pb-14 sm:gap-1 sm:p-8 sm:pb-16">
                {/* Progress bars */}
                <div className="mb-1 flex w-full gap-2">
                  {GALLERY_ITEMS.map((item, index) => (
                    <button
                      key={`bar-${item.id}`}
                      type="button"
                      aria-label={`Show ${item.title}`}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        index === activeIndex
                          ? "bg-[#d0e7e1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                          : "bg-white/30 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>

                <p className="pt-3 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[2.42px] text-[#d0e7e1]">
                  {activeItem.eyebrow}
                </p>

                <h3
                  className="text-[26px] font-semibold leading-9 tracking-[-0.6px] text-white sm:text-[32px] sm:leading-10 md:text-[36px] md:tracking-[-0.9px]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {activeItem.featuredTitle}
                </h3>

                <p className="mt-2 max-w-[512px] text-sm leading-6 text-white/80 md:text-base">
                  {activeItem.description}
                </p>

                <div className="pt-5">
                  <Link
                    href={ROUTES.CATEGORY(activeItem.category)}
                    className="inline-flex h-11 items-center gap-2 rounded bg-white px-6 text-[11px] font-bold uppercase tracking-[1.1px] text-black shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-[1.02]"
                  >
                    {activeItem.cta}
                    <Image
                      src="/images/new-gallery/arrow-right.svg"
                      alt=""
                      width={10}
                      height={10}
                      className="size-[9.6px]"
                    />
                  </Link>
                </div>
              </div>

              {/* Footer bar */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/50 px-4 py-3 backdrop-blur-[6px] sm:px-6">
                <p className="text-[9px] uppercase tracking-[0.55px] text-white/70 sm:text-[11px] sm:leading-[16.5px]">
                  CURATED IN NEW DELHI &amp; VARANASI
                </p>
                <div className="hidden items-center gap-1.5 sm:flex">
                  {GALLERY_ITEMS.map((item, index) => (
                    <span
                      key={`dot-${item.id}`}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        index === activeIndex ? "w-4 bg-white" : "w-2 bg-white/30"
                      )}
                    />
                  ))}
                </div>
                <p className="text-[9px] uppercase tracking-[0.55px] text-white/70 sm:text-[11px] sm:leading-[16.5px]">
                  LIMITED EDITION
                </p>
              </div>
            </div>
          </div>

          {/* Category cards */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5 lg:gap-0 lg:min-h-[660px]">
            {GALLERY_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              const href = ROUTES.CATEGORY(item.category);
              const thumb = item.thumbImage ?? item.image;

              return (
                <Link
                  key={item.id}
                  href={href}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-2xl border bg-white py-[18px] pl-4 pr-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-all duration-300 sm:py-[25px] sm:pl-[25px] sm:pr-[25px]",
                    isActive
                      ? "border-[#111212] shadow-[0px_8px_24px_-8px_rgba(0,0,0,0.18)]"
                      : "border-[rgba(196,199,199,0.3)] hover:border-[#111212]/40 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-[rgba(196,199,199,0.3)] bg-[#eee] sm:size-16 sm:rounded-xl">
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5 pt-1 sm:pt-1.5">
                      <p className="text-[9px] font-semibold uppercase leading-[15px] tracking-[1.5px] text-[#4e635e] sm:text-[10px] sm:tracking-[2px]">
                        {item.num} // {item.tag}
                      </p>
                      <p
                        className="truncate text-base font-semibold leading-7 text-black sm:text-lg"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] leading-[16.5px] text-[#444748]">{item.sub}</p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:size-9",
                      isActive ? "bg-[#111212]" : "bg-[#eee] group-hover:bg-[#111212]"
                    )}
                  >
                    <Image
                      src="/images/new-gallery/arrow-up-right.svg"
                      alt=""
                      width={9}
                      height={9}
                      className={cn(
                        "size-[9.2px] transition-[filter] duration-300",
                        isActive
                          ? "brightness-0 invert"
                          : "group-hover:brightness-0 group-hover:invert"
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 self-start py-1 text-[11px] font-semibold uppercase tracking-[1.1px] text-black transition-opacity hover:opacity-60 md:hidden"
        >
          <span className="relative py-0.5">
            VIEW PRODUCTS
            <span className="absolute bottom-0 left-0 right-0 h-px bg-black" />
          </span>
          <Image
            src="/images/new-gallery/arrow-right.svg"
            alt=""
            width={10}
            height={10}
            className="size-[9.6px]"
          />
        </Link>
      </div>
    </section>
  );
};

export default NewGallarySection;
