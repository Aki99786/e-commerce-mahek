import type { Metadata } from "next";
import { Suspense } from "react";
import { playfair, inter, poppins } from "@/lib/fonts";
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartWishlistProvider>
          <Toaster position="top-right" richColors closeButton />
          <TopBar />
          <Suspense fallback={null}><Header /></Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </CartWishlistProvider>
      </body>
    </html>
  );
}
