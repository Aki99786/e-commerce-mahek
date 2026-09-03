import type { Metadata } from "next";
import { Suspense } from "react";
import { generateSEO } from "@/lib/utils/seo";
import { SITE_CONFIG } from "@/constants/site";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartWishlistProvider } from "@/contexts/CartWishlistContext";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <CartWishlistProvider>
          <Toaster position="top-right" richColors closeButton />
          <div className="sticky top-0 z-40 bg-white shadow-xs">
            <TopBar />
            <Suspense fallback={null}><Header /></Suspense>
          </div>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </CartWishlistProvider>
      </body>
    </html>
  );
}
