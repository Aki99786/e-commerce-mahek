import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/site";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const DEFAULT_KEYWORDS = [
  "Indian ethnic wear",
  "sarees online",
  "lehengas",
  "bridal wear India",
  "designer sarees",
  "Banarasi sarees",
  "Kanjeevaram sarees",
  "Rajputi Poshak",
  "festive wear",
  "traditional Indian clothing",
  "Mahek Sarees",
  "luxury ethnic wear",
];

export const generateSEO = ({
  title,
  description = SITE_CONFIG.description,
  keywords = DEFAULT_KEYWORDS,
  image = "/images/og-image.jpg",
  url = SITE_CONFIG.url,
  type = "website",
  noIndex = false,
}: SEOProps = {}): Metadata => {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@maheksarees",
      site: "@maheksarees",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: url,
    },
    verification: {
      google: "",
    },
    category: "shopping",
  };
};
