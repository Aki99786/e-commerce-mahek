import type { Metadata } from "next";
import { generateSEO } from "@/lib/utils/seo";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Shopping Cart",
    description: "Review and manage your Mahek shopping cart. Secure checkout with free shipping on all orders.",
    noIndex: true,
  }),
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
