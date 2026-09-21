import Link from "next/link";

export const TopBar = () => {
  const message =
    "COMPLIMENTARY WORLDWIDE EXPRESS DELIVERY ON COUTURE  •  BOOK A VIRTUAL ATELIER FITTING  •  HERITAGE EDITION 2026 NOW LIVE";

  return (
    <div className="bg-[#111212] text-white overflow-hidden" style={{ height: "32px" }}>
      <div className="flex items-center h-full relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #111212, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #111212, transparent)" }}
        />

        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 px-8">
              <span className="text-[10px] tracking-[0.2em] font-medium text-white/80">
                {message}
              </span>
              <Link
                href="/products"
                className="text-[10px] tracking-[0.18em] font-semibold text-white border-b border-white/40 hover:border-white transition-colors pb-px"
              >
                SHOP NOW
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
