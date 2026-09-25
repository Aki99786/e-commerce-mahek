import type { Metadata } from "next";
import { generateSEO } from "@/lib/utils/seo";

export const metadata: Metadata = {
  ...generateSEO({
    title: "My Wishlist",
    description: "Save your favourite Mahek ethnic wear to your wishlist. Revisit bridal lehengas, silk sarees and couture pieces you love.",
    noIndex: true,
  }),
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
