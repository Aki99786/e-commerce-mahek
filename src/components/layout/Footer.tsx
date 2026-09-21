"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES } from "@/constants/categories";

const collections = [
  { label: "Festive Couture", href: "/products?category=lehenga" },
  { label: "Occasion Silks", href: "/products?category=sarees" },
  { label: "Handcrafted Kurtas", href: "/products?category=kurta" },
  { label: "Archive Sale", href: ROUTES.SALE },
];

const bespokeServices = [
  { label: "Track Order", href: ROUTES.TRACK_ORDER },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Exchange Concierge", href: "/returns" },
  { label: "Virtual Fitting Room", href: "/virtual-fitting" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#111212]">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.HOME}>
              <p
                className="text-xl font-bold text-white tracking-[0.3em] mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                MAHEK
              </p>
            </Link>
            <p className="text-xs text-white/45 leading-relaxed mb-5 max-w-xs">
              Redefining contemporary ethnic luxury. Uncompromising artisanal craftsmanship engineered
              for the digital age, uniting heritage textiles with architectural silhouettes.
            </p>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[9px] tracking-[0.2em] text-white/30 uppercase font-medium">
                Curated Digital Atelier
              </span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <p className="text-[9px] tracking-[0.25em] text-white/30 uppercase font-semibold mb-4">
              Collections
            </p>
            <ul className="space-y-2.5">
              {collections.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-white/50 hover:text-white transition-colors leading-relaxed"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bespoke Services */}
          <div>
            <p className="text-[9px] tracking-[0.25em] text-white/30 uppercase font-semibold mb-4">
              Bespoke Services
            </p>
            <ul className="space-y-2.5">
              {bespokeServices.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-white/50 hover:text-white transition-colors leading-relaxed"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The Private Registry — newsletter */}
          <div>
            <p className="text-[9px] tracking-[0.25em] text-white/30 uppercase font-semibold mb-4">
              The Private Registry
            </p>
            <p className="text-xs text-white/45 leading-relaxed mb-5">
              Receive exclusive previews of seasonal capsules, private trunk exhibitions, and curated releases.
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white text-xs px-4 py-3 outline-none focus:border-white/30 placeholder:text-white/25 transition-colors"
              />
              <button
                onClick={() => setEmail("")}
                className="bg-white text-[#111212] text-[9px] tracking-[0.15em] font-bold px-4 py-3 hover:bg-[#F4F3F3] transition-colors whitespace-nowrap flex-shrink-0"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/25">
            © 2026 MAHEK. Engineered Elegance. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["About Us", "Privacy Policy", "Terms of Service"].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
