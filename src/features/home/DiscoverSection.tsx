import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    num: "01",
    tag: "HEIRLOOM ARTISTRY",
    title: "Bridal Lehengas",
    sub: "Heritage Edition 2026",
    image: "/images/categories1.png",
    href: "/products?category=lehenga",
  },
  {
    num: "02",
    tag: "HERITAGE ZARI",
    title: "Silk Sarees",
    sub: "Heritage Edition 2026",
    image: "/images/categories2.png",
    href: "/products?category=sarees",
  },
  {
    num: "03",
    tag: "ROYAL RESHAM",
    title: "Rajputi Poshak",
    sub: "Heritage Edition 2026",
    image: "/images/categories5.png",
    href: "/products?category=rajputi-poshak",
  },
  {
    num: "04",
    tag: "VIBRANT EMBROIDERIES",
    title: "Festive Lehengas",
    sub: "Heritage Edition 2026",
    image: "/images/categories3.png",
    href: "/products?category=lehenga",
  },
  {
    num: "05",
    tag: "PURE KATAN SILK",
    title: "Banarasi Sarees",
    sub: "Heritage Edition 2026",
    image: "/images/categories4.png",
    href: "/products?category=banarasi",
  },
];

export const DiscoverSection = () => {
  return (
    <section className="bg-[#F9F9F9] py-8 md:py-14 border-t border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 md:mb-8 md:mb-10 gap-3">
          <div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111212] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              DISCOVER
            </h2>
            <p className="text-xs md:text-sm text-[#6B6B6B] mt-2 max-w-md leading-relaxed">
              Handcrafted heirloom textiles, architectural silhouettes, and ancestral Indian
              craftsmanship reimagined for the modern sovereign bride.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] font-bold text-[#111212] uppercase border-b border-[#111212] hover:opacity-60 transition-opacity pb-px mt-2"
          >
            VIEW PRODUCTS
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Left — Feature card */}
          <div className="lg:col-span-3">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#111212]" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/images/leftbigimg.png"
                alt="Banarasi & Kanjeevaram"
                fill
                className="object-cover opacity-75"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                <p className="text-[8px] tracking-[0.3em] text-white/50 uppercase mb-2">
                  Pure Craft Mastery
                </p>
                <h3
                  className="text-2xl md:text-3xl font-semibold text-white mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Banarasi & Kanjeevaram
                </h3>
                <p className="text-sm text-white/60 mb-6 max-w-sm leading-relaxed">
                  Pure mulberry and katan silks woven with real silver-gilt zari.
                  Masterclass drapes celebrating centuries of Banaras and Kanchipuram weaving guilds.
                </p>
                <Link
                  href="/products?category=banarasi"
                  className="inline-flex items-center gap-2 border border-white/40 text-white text-[10px] tracking-[0.2em] font-semibold px-5 py-2.5 hover:bg-white hover:text-black transition-all duration-300"
                >
                  EXPLORE SILK SAREES
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <div className="flex items-center gap-6 mt-6 border-t border-white/10 pt-4">
                  <p className="text-[8px] tracking-[0.25em] text-white/30 uppercase">
                    Curated in New Delhi & Varanasi
                  </p>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-[2px] transition-all ${i === 0 ? "w-6 bg-white" : "w-3 bg-white/20"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[8px] tracking-[0.15em] text-white/30 uppercase ml-auto">
                    Limited Edition
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Category index */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.num}
                href={cat.href}
                className="group flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-[#E8E6E1] hover:border-[#111212] hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F4F3F3]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] tracking-[0.2em] text-[#9B9B9B] uppercase font-medium">
                    {cat.num} // {cat.tag}
                  </p>
                  <p className="text-sm font-semibold text-[#111212] mt-0.5 truncate">{cat.title}</p>
                  <p className="text-[10px] text-[#9B9B9B]">{cat.sub}</p>
                </div>
                <div className="w-7 h-7 rounded-full border border-[#E8E6E1] group-hover:border-[#111212] group-hover:bg-[#111212] flex items-center justify-center transition-all flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-[#9B9B9B] group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
