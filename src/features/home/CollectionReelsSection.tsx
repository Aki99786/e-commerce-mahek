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
}

interface InstagramRawItem {
  id: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
  caption?: string;
}

const FALLBACK_REELS_DATA: CollectionReel[] = [
  {
    id: "18142366873597792",
    designer: "MAHEK SAREES",
    title: "Hand-Embroidered Silk Lehenga",
    reelTitle: "Reel: Bridal Veil Trails",
    views: "84.2K Views",
    audioName: "Atelier Audio",
    image:
      "https://scontent-atl3-2.cdninstagram.com/v/t51.82787-15/813949319_18100056578124431_8672931102487562280_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQJqNNexTf1cvuKngoSxmwNiJQ5YzrFNHseAPrTImrbCbQ&oe=6AB84155",
    video:
      "https://scontent-atl3-1.cdninstagram.com/o1/v/t2/f2/m86/AQP4sYphOvvo-0Iz5qr7pyAvXB31KtTBAsMbcY0seyRKbRNrWRDuaxR5AdE9SHqU24lYSX3zcerzf3Wwqo3bDUULFH1JjayRYC9WGxg.mp4?_nc_cat=107&_nc_sid=5e9851&_nc_ht=scontent-atl3-1.cdninstagram.com&_nc_ohc=SK2uSvovFaIQ7kNvwGwfqjN&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTQxMTA5ODAyNDUzNTg0MCwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjoxNSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=9a209cc6d087a13f&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQIO7o8LWHPDp5KCMYG9Of2lp53FcLBjAkwbY_FyVvv_Ug&oe=6AB46540",
    permalink: "https://www.instagram.com/reel/DdalgX9pV8c/",
    href: "/products?category=lehenga",
  },
  {
    id: "18429142594180468",
    designer: "MANISH MALHOTRA",
    title: "Emerald Kanjeevaram Saree",
    reelTitle: "Reel: Saree Draping Masterclass",
    views: "120K Views",
    audioName: "Atelier Audio",
    image:
      "https://scontent-atl3-1.cdninstagram.com/v/t51.82787-15/813949333_18100056044124431_1983009570833648712_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQIIwF-hFy6RGmV0",
    video:
      "https://scontent-atl3-2.cdninstagram.com/o1/v/t2/f2/m86/AQNleGMe_L4ZXZdARWPlPBki5dKEUqe-I0FJvDvuzhPCJrpBKTxtrDPVnG5D1GpS5F07fkpnN7Gz69NZkrHOIhlaGQZB8VPshM9nY-E.mp4?_nc_cat=105&_nc_sid=5e9851&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_ohc=UgAJT8N9ArYQ7kNvwHOIChg&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MzYwNzg4MTUwNjAyNjE2NiwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo4LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=f7e55f4b70ff2b36&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQIgi8s4PWZPSA399qeW715JQhGiHFWnPWGkJ9z8vcq_HA&oe=6AB44812",
    permalink: "https://www.instagram.com/reel/DdalQEJpzJD/",
    href: "/products?category=banarasi-saree",
  },
  {
    id: "18207760438363352",
    designer: "ANITA DONGRE",
    title: "Royal Navy Blue Zari Saree",
    reelTitle: "Reel: Royal Navy Pallu Flow",
    views: "95.4K Views",
    audioName: "Atelier Audio",
    image:
      "https://scontent-atl3-1.cdninstagram.com/v/t51.82787-15/815187650_18100055891124431_673786318715838527_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQJTOGug8xCjxKNbC_OEev98QtL_7C5vpPe_fbug_st8Sg&oe=6AB86306",
    video:
      "https://instagram.fidr7-1.fna.fbcdn.net/o1/v/t2/f2/m86/AQN2kQPMlu7PKcnevhHG2NwCro4A_OV-6jP3Ft9W2XjLhXsNVBEKuwFxhVCiuRZAtjlakdUHVLWzs7Hpe2FlAt3eTJusXPpKBQF6TU8.mp4?_nc_cat=107&_nc_sid=5e9851&_nc_ht=instagram.fidr7-1.fna.fbcdn.net&_nc_ohc=Na10HCPXnokQ7kNvwHwQIp6&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6NDM1NDg1NjQ3ODEwMTMzMiwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo0LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=eedffec6e71aac79&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQJ3P52ENsc2W4TmquHd5BFKFUiGMd34qlXH3-SwS-Y2cg&oe=6AB46604",
    permalink: "https://www.instagram.com/reel/DdalHaIpeEW/",
    href: "/products?category=saree",
  },
  {
    id: "18629929909044633",
    designer: "MAHEK SAREES",
    title: "Festive Twirls & Flare",
    reelTitle: "Reel: Jai Shree Ganesh Edition",
    views: "118K Views",
    audioName: "Original Audio",
    image:
      "https://scontent-atl3-1.cdninstagram.com/v/t51.82787-15/813332518_18099840086124431_6743682014731076458_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQKnk5D4QldnMvfZLIu37Ou3AsbL6pHmU8AHIPKXkwbA3Q&oe=6AB8555E",
    video:
      "https://instagram.fidr7-1.fna.fbcdn.net/o1/v/t2/f2/m86/AQOCFzaUPsHjXEOmuz1PTqsRIBvtZAnVDiPbBMGN4unrDWpXxBx9KPh15VceyIY-GTD6NKv2bMHWFS7WSLFpUbV7rzN9QpmkEGf3sv4.mp4?_nc_cat=104&_nc_sid=5e9851&_nc_ht=instagram.fidr7-1.fna.fbcdn.net&_nc_ohc=3DCulGqc1WgQ7kNvwHH0Srf&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMjQwLmRhc2hfYmFzZWxpbmVfM192MSIsInhwdl9hc3NldF9pZCI6MTUxMzg0NDI2MDc2ODU1MywiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo2NSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=f18164497a419c&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQJdBAqnjqEht2sKRsl79wNEQAN30oWwBExSSGK2M7iiLw&oe=6AB45251",
    permalink: "https://www.instagram.com/reel/DdY8iorJ-LP/",
    href: "/products?category=lehenga",
  },
];

export const CollectionReelsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [reels, setReels] = useState<CollectionReel[]>(FALLBACK_REELS_DATA);
  const [activeVideoModal, setActiveVideoModal] = useState<CollectionReel | null>(null);
  const [hoveredReelId, setHoveredReelId] = useState<string | null>(null);
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Toggle Mute / Unmute with real sound
  const toggleMute = (reelId: string) => {
    if (unmutedReelId === reelId) {
      // Currently playing with sound -> Mute it
      const currentVid = videoRefs.current[reelId];
      if (currentVid) {
        currentVid.muted = true;
      }
      setUnmutedReelId(null);
    } else {
      // Mute previously unmuted video
      if (unmutedReelId && videoRefs.current[unmutedReelId]) {
        videoRefs.current[unmutedReelId]!.muted = true;
      }

      // Unmute new video and play
      const targetVid = videoRefs.current[reelId];
      if (targetVid) {
        targetVid.muted = false;
        targetVid.play().catch(() => {});
      }
      setUnmutedReelId(reelId);
    }
  };

  const openModal = (reel: CollectionReel) => {
    // Mute card video when opening modal to prevent audio clash
    if (unmutedReelId && videoRefs.current[unmutedReelId]) {
      videoRefs.current[unmutedReelId]!.muted = true;
      setUnmutedReelId(null);
    }
    setActiveVideoModal(reel);
  };

  // Fetch Live Instagram Reels from API Route
  useEffect(() => {
    const fetchInstagramReels = async () => {
      try {
        const res = await fetch("/api/instagram-reels");
        if (!res.ok) return;

        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const designerPool = [
            "MAHEK SAREES",
            "SABYASACHI",
            "MANISH MALHOTRA",
            "ANITA DONGRE",
            "TARUN TAHILIANI",
          ];
          const viewCounters = [
            "84.2K Views",
            "120K Views",
            "95.4K Views",
            "65.8K Views",
            "118K Views",
            "102K Views",
          ];

          const mapped: CollectionReel[] = json.data.map(
            (item: InstagramRawItem, idx: number) => {
              const isVideo = item.media_type === "VIDEO" && Boolean(item.media_url);
              const caption = item.caption ? item.caption.trim() : "";
              const firstLine = caption
                ? caption.split("\n")[0].slice(0, 36)
                : "Handcrafted Luxury Couture";

              return {
                id: item.id || `insta-${idx}`,
                designer: designerPool[idx % designerPool.length],
                title: firstLine,
                reelTitle: caption ? caption.slice(0, 32) : "Exclusive Atelier Look",
                views: viewCounters[idx % viewCounters.length],
                audioName: "Original Audio",
                image: item.thumbnail_url || item.media_url || "/images/pd4.jpg",
                video: isVideo ? item.media_url : undefined,
                permalink: item.permalink,
                href: item.permalink || "/products",
              };
            }
          );

          if (mapped.length > 0) {
            setReels(mapped);
          }
        }
      } catch (err) {
        console.warn("Using default Instagram reels fallback:", err);
      }
    };

    fetchInstagramReels();
  }, []);

  // Auto-scroll reels smoothly
  useEffect(() => {
    if (isPaused || activeVideoModal) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      // When reached the end, smoothly wrap back to start
      if (container.scrollLeft >= maxScroll - 20) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Step forward by one reel card width + gap
        const firstCard = container.querySelector(".snap-start") as HTMLElement;
        const cardStep = firstCard ? firstCard.offsetWidth + 24 : 310;
        container.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, activeVideoModal]);

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
          {reels.map((reel) => {
            const hasVideo = Boolean(reel.video && isVideoUrl(reel.video));
            const isHovered = hoveredReelId === reel.id;

            return (
              <div
                key={reel.id}
                onMouseEnter={() => setHoveredReelId(reel.id)}
                onMouseLeave={() => setHoveredReelId(null)}
                className="snap-start shrink-0 w-[270px] sm:w-[290px] md:w-[310px] lg:w-[calc(25%-18px)] group relative aspect-[9/15] rounded-[12px] overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Media: Autoplay Video with poster fallback */}
                {hasVideo ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={reel.video}
                    poster={reel.image}
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
                    unoptimized={reel.image.includes("cdninstagram") || reel.image.includes("fbcdn")}
                  />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 pointer-events-none" />

                {/* Top Floating Glass Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                  {/* Clickable Audio Pill: Mute / Unmute */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(reel.id);
                    }}
                    className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-medium tracking-wide transition-all shadow-md cursor-pointer select-none"
                    title={unmutedReelId === reel.id ? "Click to Mute Audio" : "Click to Play Audio"}
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

                  {/* Views count pill */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/95 text-[10px] sm:text-[11px] font-semibold tracking-wider">
                    {reel.views}
                  </span>
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

                  {/* Divider */}
                  <div className="border-t border-white/20 my-3" />

                  {/* Action Link: Shop Look / Watch on IG */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white">
                    <Link
                      href={reel.href}
                      className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
                      onClick={(e) => {
                        if (reel.permalink) {
                          e.stopPropagation();
                        }
                      }}
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
          })}
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
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player or High-Res Reel Display */}
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
                    activeVideoModal.image.includes("cdninstagram") ||
                    activeVideoModal.image.includes("fbcdn")
                  }
                />
              </div>
            )}

            {/* Modal Bottom Banner */}
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
