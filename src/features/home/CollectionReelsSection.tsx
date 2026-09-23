"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  ArrowRight,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { isVideoUrl } from "@/lib/utils/media";
import { productService } from "@/features/products/services/product.service";
import type { Product as APIProduct } from "@/features/products/types";
import { ROUTES } from "@/constants/routes";

interface CollectionReel {
  id: string;
  designer: string;
  title: string;
  reelTitle: string;
  views: string;
  audioName?: string;
  image: string;
  video?: string;
  permalink?: string;
  href: string;
  sellingPrice?: number;
  mrp?: number;
  isWishlist?: boolean;
  isCartActive?: boolean;
  category?: string;
}

const FALLBACK_POSTER = "/images/pd4.jpg";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatPriceLabel(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function mapProductToReel(product: APIProduct): CollectionReel | null {
  const variant = product.variant ?? product.product_variants?.[0];
  const mediaUrls = variant?.images?.filter(Boolean) ?? [];
  if (mediaUrls.length === 0) return null;

  const videoUrl = mediaUrls.find((url) => isVideoUrl(url));
  const imageUrl =
    mediaUrls.find((url) => !isVideoUrl(url)) ?? videoUrl ?? FALLBACK_POSTER;

  const sizes = variant?.sizes ?? [];
  const sellingPrices = sizes
    .map((s) => s.selling_price)
    .filter((price): price is number => typeof price === "number" && price > 0);
  const mrps = sizes
    .map((s) => s.mrp)
    .filter((price): price is number => typeof price === "number" && price > 0);

  const minSelling =
    sellingPrices.length > 0 ? Math.min(...sellingPrices) : undefined;
  const maxMrp = mrps.length > 0 ? Math.max(...mrps) : undefined;

  const descriptionText = stripHtml(product.description || "");
  const categoryLabel = (product.category || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: product._id,
    designer: (product.brand || "Mahek Sarees").toUpperCase(),
    title: product.product_name || "Collection Look",
    reelTitle:
      descriptionText.slice(0, 48) ||
      categoryLabel ||
      product.fabric ||
      "Exclusive Atelier Look",
    views: minSelling !== undefined ? formatPriceLabel(minSelling) : "",
    audioName: "Original Audio",
    image: imageUrl,
    video: videoUrl,
    href: ROUTES.PRODUCT_DETAIL(product._id),
    sellingPrice: minSelling,
    mrp: maxMrp,
    isWishlist: sizes.some((s) => Boolean(s.is_wishlist)),
    isCartActive: sizes.some((s) => Boolean(s.is_cart_active)),
    category: product.category,
  };
}

export const CollectionReelsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [reels, setReels] = useState<CollectionReel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<CollectionReel | null>(null);
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Toggle Mute / Unmute with real sound
  const toggleMute = (reelId: string) => {
    if (unmutedReelId === reelId) {
      const currentVid = videoRefs.current[reelId];
      if (currentVid) {
        currentVid.muted = true;
      }
      setUnmutedReelId(null);
    } else {
      if (unmutedReelId && videoRefs.current[unmutedReelId]) {
        videoRefs.current[unmutedReelId]!.muted = true;
      }

      const targetVid = videoRefs.current[reelId];
      if (targetVid) {
        targetVid.muted = false;
        targetVid.play().catch(() => {});
      }
      setUnmutedReelId(reelId);
    }
  };

  const openModal = (reel: CollectionReel) => {
    if (unmutedReelId && videoRefs.current[unmutedReelId]) {
      videoRefs.current[unmutedReelId]!.muted = true;
      setUnmutedReelId(null);
    }
    setActiveVideoModal(reel);
  };

  // Fetch reel products from API once on mount
  useEffect(() => {
    let cancelled = false;

    const fetchReelsProducts = async () => {
      try {
        const response = await productService.getReelsProducts();
        if (cancelled) return;

        const products = Array.isArray(response?.products) ? response.products : [];
        const mapped = products
          .map(mapProductToReel)
          .filter((reel): reel is CollectionReel => reel !== null);

        setReels(mapped);
      } catch (error) {
        console.error("Failed to fetch reels products:", error);
        if (!cancelled) {
          setReels([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchReelsProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll reels smoothly
  useEffect(() => {
    if (isPaused || activeVideoModal || reels.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const firstCard = container.querySelector(".snap-start") as HTMLElement;
        const cardStep = firstCard ? firstCard.offsetWidth + 24 : 310;
        container.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, activeVideoModal, reels.length]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 md:py-14 lg:py-18 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Arrows */}
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-1.5">
              Social Runway
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Our Collection Reels
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 active:scale-95 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 active:scale-95 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reels Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 2000);
          }}
          className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[270px] sm:w-[290px] md:w-[310px] lg:w-[calc(25%-18px)] aspect-[9/15] rounded-[12px] bg-stone-100 animate-pulse"
              />
            ))
          ) : reels.length === 0 ? (
            <div className="w-full py-16 text-center text-sm text-stone-500">
              No collection reels available right now.
            </div>
          ) : (
            reels.map((reel) => {
              const hasVideo = Boolean(reel.video && isVideoUrl(reel.video));

              return (
                <div
                  key={reel.id}
                  className="snap-start shrink-0 w-[270px] sm:w-[290px] md:w-[310px] lg:w-[calc(25%-18px)] group relative aspect-[9/15] rounded-[12px] overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Media: Autoplay Video with poster fallback */}
                  {hasVideo ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[reel.id] = el;
                      }}
                      src={reel.video}
                      poster={
                        reel.image && !isVideoUrl(reel.image) ? reel.image : undefined
                      }
                      autoPlay
                      loop
                      muted={unmutedReelId !== reel.id}
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={reel.image}
                      alt={reel.title}
                      fill
                      sizes="(max-width: 640px) 270px, (max-width: 1024px) 310px, 340px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      unoptimized={
                        reel.image.startsWith("http") &&
                        (reel.image.includes("cdninstagram") ||
                          reel.image.includes("fbcdn") ||
                          reel.image.includes("storage.googleapis.com"))
                      }
                    />
                  )}

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 pointer-events-none" />

                  {/* Top Floating Glass Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute(reel.id);
                      }}
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-medium tracking-wide transition-all shadow-md cursor-pointer select-none"
                      title={
                        unmutedReelId === reel.id
                          ? "Click to Mute Audio"
                          : "Click to Play Audio"
                      }
                    >
                      {unmutedReelId === reel.id ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          <span className="font-semibold text-rose-200">
                            {reel.audioName || "Original Audio"}
                          </span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-white/70" />
                          <span className="text-white/90">
                            {reel.audioName || "Original Audio"}
                          </span>
                        </>
                      )}
                    </button>

                    {reel.views ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/95 text-[10px] sm:text-[11px] font-semibold tracking-wider">
                        {reel.views}
                      </span>
                    ) : null}
                  </div>

                  {/* Center Floating Play Button */}
                  <button
                    type="button"
                    onClick={() => openModal(reel)}
                    aria-label={`Play ${reel.title}`}
                    className="absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-black/60 transition-all duration-300 shadow-2xl z-10 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                  </button>

                  {/* Bottom Content Info */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col justify-end text-white">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                      {reel.designer}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-1 leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {reel.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/65 italic mt-0.5 line-clamp-1">
                      {reel.reelTitle}
                    </p>

                    <div className="border-t border-white/20 my-3" />

                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white">
                      <Link
                        href={reel.href}
                        className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Shop Look</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {reel.permalink && (
                        <a
                          href={reel.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white/60 hover:text-white transition-colors"
                          title="Open on Instagram"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Video Reel Interactive Modal */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-sm aspect-[9/16] max-h-[88vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeVideoModal.video && isVideoUrl(activeVideoModal.video) ? (
              <video
                src={activeVideoModal.video}
                autoPlay
                controls
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={activeVideoModal.image}
                  alt={activeVideoModal.title}
                  fill
                  className="object-cover"
                  unoptimized={
                    activeVideoModal.image.startsWith("http") &&
                    (activeVideoModal.image.includes("cdninstagram") ||
                      activeVideoModal.image.includes("fbcdn") ||
                      activeVideoModal.image.includes("storage.googleapis.com"))
                  }
                />
              </div>
            )}

            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white z-20">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                {activeVideoModal.designer}
              </span>
              <h4 className="text-base font-bold mt-0.5">{activeVideoModal.title}</h4>
              <p className="text-xs text-white/60 italic">{activeVideoModal.reelTitle}</p>

              <div className="mt-3.5 flex items-center gap-2">
                <Link
                  href={activeVideoModal.href}
                  onClick={() => setActiveVideoModal(null)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white text-stone-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Shop Look
                </Link>

                {activeVideoModal.permalink && (
                  <a
                    href={activeVideoModal.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CollectionReelsSection;
