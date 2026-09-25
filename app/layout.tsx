import type { Metadata } from "next";
import { Suspense } from "react";
import { generateSEO } from "@/lib/utils/seo";
import { SITE_CONFIG } from "@/constants/site";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartWishlistProvider } from "@/contexts/CartWishlistContext";
import { SizeModalProvider } from "@/contexts/SizeModalContext";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  ...generateSEO(),
  icons: {
    icon: "/images/mahek_sarees_logo.svg",
    shortcut: "/images/mahek_sarees_logo.svg",
    apple: "/images/mahek_sarees_logo.svg",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#111212",
    "color-scheme": "light",
    "format-detection": "telephone=no",
  },
};

// JSON-LD structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_CONFIG.url}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/images/mahek_sarees_logo.svg`,
        width: 200,
        height: 60,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.phone,
        contactType: "customer service",
        areaServed: ["IN", "US", "GB", "AE"],
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.instagram.com/mahek_saree_lehenga_house",
        "https://www.youtube.com/@maheksarees6599",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Varanasi",
        addressCountry: "IN",
        streetAddress: SITE_CONFIG.address,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <CartWishlistProvider>
          <SizeModalProvider>
            <Toaster position="top-right" richColors closeButton />
            <div className="sticky top-0 z-40 bg-white shadow-xs">
              <TopBar />
              <Suspense fallback={null}>
                <Header />
              </Suspense>
            </div>
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </SizeModalProvider>
        </CartWishlistProvider>
      </body>
    </html>
  );
}
