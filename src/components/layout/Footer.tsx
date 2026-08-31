import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/constants/site";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES } from "@/constants/categories";

const linkClass = "text-xs text-white/60 hover:text-white transition-colors leading-relaxed";
const headingClass = "text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3";

export const Footer = () => {
  return (
    <footer className="bg-[#120808]">

      {/* Main link grid */}
      <div className="container-fluid pt-8 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10">

          {/* Categories */}
          <div>
            <p className={headingClass}>Categories</p>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`} className={linkClass}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className={headingClass}>Quick Links</p>
            <ul className="space-y-2">
              {[
                { label: "Home", href: ROUTES.HOME },
                { label: "About Us", href: ROUTES.ABOUT },
                { label: "All Products", href: ROUTES.SHOP },
                { label: "Sale", href: ROUTES.SALE },
                { label: "Trending", href: ROUTES.TRENDING },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className={headingClass}>Support</p>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Track Order", href: ROUTES.TRACK_ORDER },
                { label: "Shipping & Delivery", href: "/shipping" },
                { label: "No Exchange & Return", href: "/returns" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className={headingClass}>Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-white/60 leading-relaxed">{SITE_CONFIG.workingHours}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-white/60 break-all">{SITE_CONFIG.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-white/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-white/60 leading-relaxed">{SITE_CONFIG.address}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="container-fluid">
        <div className="border-t border-white/10" />
      </div>

      {/* Bottom bar */}
      <div className="container-fluid py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Left — logo + copyright */}
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <Link href={ROUTES.HOME}>
              <Image
                src="/images/mahek_sarees_logo.svg"
                alt="Mahek Sarees"
                width={32}
                height={32}
                className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-[11px] text-white/40">
              © 2026 Mahek Sarees. All rights reserved.
            </p>
          </div>

          {/* Center — social icons */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {[
              {
                href: SOCIAL_LINKS.facebook, label: "Facebook",
                svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
              },
              {
                href: SOCIAL_LINKS.instagram, label: "Instagram",
                svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
              },
              {
                href: SOCIAL_LINKS.youtube, label: "YouTube",
                svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
              },
            ].map(({ href, label, svg }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-white/70" fill="currentColor" viewBox="0 0 24 24">{svg}</svg>
              </Link>
            ))}
          </div>

          {/* Right — payment + secure badge */}
          <div className="flex items-center gap-3 order-3">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[11px] text-white/50">Secure Payments</span>
            </div>
            <Image
              src="/images/payment.png"
              alt="Payment Methods"
              width={80}
              height={20}
              className="h-5 w-auto opacity-60"
            />
          </div>

        </div>
      </div>

    </footer>
  );
};
