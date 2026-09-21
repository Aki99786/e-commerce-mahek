import type { Metadata } from "next";
import { generateSEO } from "@/lib/utils/seo";
import { SITE_CONFIG } from "@/constants/site";
import { HeroSection } from "@/features/home/HeroSection";
import { CollectionReelsSection } from "@/features/home/CollectionReelsSection";
import { CategorySection } from "@/features/home/CategorySection";
import { FlashSaleSection } from "@/features/home/FlashSaleSection";
import { BestSellingSection } from "@/features/home/BestSellingSection";
import { DiscoverSection } from "@/features/home/DiscoverSection";
import { ReviewsSection } from "@/features/home/ReviewsSection";
import { FeaturesSection } from "@/features/home/FeaturesSection";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Luxury Indian Ethnic Wear — Sarees, Lehengas & Bridal Couture",
    description:
      "Discover Mahek's heritage couture collection: hand-embroidered silk lehengas, Banarasi sarees, Kanjeevaram drapes, and bespoke bridal silhouettes. Curated in New Delhi & Varanasi.",
    keywords: [
      "luxury Indian ethnic wear",
      "bridal lehenga online",
      "Banarasi saree",
      "Kanjeevaram saree",
      "hand-embroidered silk lehenga",
      "heritage bridal couture",
      "designer sarees India",
      "Rajputi Poshak",
      "Mahek Sarees",
      "buy sarees online India",
    ],
    url: SITE_CONFIG.url,
    type: "website",
  }),
};

// JSON-LD for the Home page (Store + Product Listing schema)
const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  description:
    "Premium Indian ethnic wear: Sarees, Lehengas, and Traditional Outfits. Handcrafted heritage textiles curated in New Delhi & Varanasi.",
  image: `${SITE_CONFIG.url}/images/top-slider.png`,
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address,
    addressLocality: "Varanasi",
    addressCountry: "IN",
  },
  priceRange: "₹₹₹",
  openingHours: "Mo-Sa 10:00-22:00",
  sameAs: [
    "https://www.instagram.com/mahek_saree_lehenga_house",
    "https://www.youtube.com/@maheksarees6599",
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD for ClothingStore */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <div className="bg-[#F4F3F3]">
        {/* 1. Hero — split dark card with bridal image + trust strip */}
        <HeroSection />
        {/* 2. Social Runway — Collection Reels carousel */}
        <CollectionReelsSection />
        {/* 3. Couture Silhouettes — Shop by Category */}
        <CategorySection />
        {/* 4. The Curated Vault — countdown sale banner */}
        <FlashSaleSection />
        {/* 5. Best Selling — editorial product grid */}
        <BestSellingSection />
        {/* 6. Discover — heritage masterpiece split section */}
        <DiscoverSection />
        {/* 7. Client Acclaim — trousseau reviews */}
        <ReviewsSection />
        {/* 8. 4-Pillar Luxury Trust assurance strip */}
        <FeaturesSection />
      </div>
    </>
  );
}
