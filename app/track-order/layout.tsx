import type { Metadata } from "next";
import { generateSEO } from "@/lib/utils/seo";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Track My Order",
    description: "Track your Mahek order status in real time. View shipping details, delivery timeline and AWB tracking for your ethnic wear purchases.",
    noIndex: true,
  }),
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
