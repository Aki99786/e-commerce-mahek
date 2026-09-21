import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/product/"],
        disallow: [
          "/cart",
          "/wishlist",
          "/checkout",
          "/profile",
          "/track-order",
          "/login",
          "/forgot-password",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/products", "/product/"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
