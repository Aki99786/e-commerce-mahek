"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { CategoryEnum } from "@/constants/categories";
import { TypingPlaceholder } from "@/components/ui/TypingPlaceholder";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { isAuthenticated, clearAuth } from "@/lib/auth-utils";
import { useCartWishlist } from "@/contexts/CartWishlistContext";

const SEARCH_PLACEHOLDERS = [
  "Search Banarasi Sarees...",
  "Search Sarees...",
  "Search Lehenga...",
  "Search Rajputi Poshak...",
  "Search Bridal Lehenga...",
];

export const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount, wishlistCount } = useCartWishlist();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuth(isAuthenticated());

    const handleStorageChange = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);
    
    const interval = setInterval(() => {
      setIsAuth(isAuthenticated());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [mounted]);

  return (
    <header className="bg-white border-b border-border-light relative z-49">
      <div className="container-fluid">
        <div className="flex items-center justify-between min-h-[60px] py-2">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href={ROUTES.HOME} className="flex items-center">
              <Image
                src="/images/mahek_sarees_logo.svg"
                alt="Mahek Sarees"
                width={60}
                height={60}
                className="w-12 h-12 md:w-14 md:h-14 cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href={ROUTES.HOME}
              className="text-sm font-inter text-text-primary hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-sm font-inter text-text-primary hover:text-primary transition-colors flex items-center gap-1 font-medium">
                Shop
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 rounded-sm z-51">
                <Link href={`/products?category=${CategoryEnum.SAREES}`} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Sarees
                </Link>
                <Link href={`/products?category=${CategoryEnum.BANARASI_SAREES}`} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Banarasi Sarees
                </Link>
                <Link href={`/products?category=${CategoryEnum.LEHENGA}`} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Lehanga
                </Link>
                <Link href={`/products?category=${CategoryEnum.RAJPUTI_POSHAK}`} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Rajputi Poshak
                </Link>
                <Link href={`/products?category=${CategoryEnum.BRIDAL_LEHENGA}`} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Bridal Lehanga
                </Link>
              </div>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="text-sm font-inter text-text-primary hover:text-primary transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href={ROUTES.SALE}
              className="text-sm font-inter text-text-primary hover:text-primary transition-colors font-medium"
            >
              Sale
            </Link>
            <Link
              href={ROUTES.TRENDING}
              className="text-sm font-inter text-text-primary hover:text-primary transition-colors font-medium"
            >
              Trending Collection
            </Link>
            <Link
              href={ROUTES.TRACK_ORDER}
              className="text-sm font-inter text-text-primary hover:text-primary transition-colors font-medium"
            >
              Track Order
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="text-text-primary hover:text-primary transition-colors cursor-pointer"
              onClick={() => {
                const currentSearch = searchParams.get('search') ?? '';
                setSearchQuery(currentSearch);
                setIsSearchOpen(!isSearchOpen);
              }}
              aria-label="Search"
            >
              <svg className="w-5 h-5 cursor-pointer select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href={ROUTES.WISHLIST}
              className="relative text-text-primary hover:text-primary transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5 cursor-pointer select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isAuth ? (
              <ProfileDropdown />
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="text-text-primary hover:text-primary transition-colors cursor-pointer"
                aria-label="Account"
              >
                <svg className="w-5 h-5 cursor-pointer select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            <Link
              href={ROUTES.CART}
              className="relative text-text-primary hover:text-primary transition-colors cursor-pointer"
              aria-label="Cart"
            >
              <svg className="w-5 h-5 cursor-pointer select-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[300px] max-w-[88vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Sidebar Header — gradient band */}
        <div className="relative bg-gradient-to-r from-[#1a0a0a] to-[#3d1515] px-5 py-5 flex items-center justify-between flex-shrink-0">
          <Link href={ROUTES.HOME} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20 overflow-hidden">
              <Image
                src="/images/mahek_sarees_logo.svg"
                alt="Mahek Sarees"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <p className="text-white font-playfair font-bold text-base leading-tight">Mahek Sarees</p>
              <p className="text-white/60 font-poppins text-[11px] mt-0.5">Premium Ethnic Wear</p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav body */}
        <nav className="flex-1 overflow-y-auto">

          {/* Main nav links */}
          <div className="px-4 pt-4 pb-2">
            <Link
              href={ROUTES.HOME}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold font-poppins text-gray-800 hover:bg-rose-50 hover:text-rose-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Shop — Category section */}
          <div className="px-4 pb-2">
            <div className="mb-2 px-3">
              <p className="text-[10px] font-poppins font-semibold text-gray-400 uppercase tracking-widest">Shop by Category</p>
            </div>
            <div className="space-y-1">
              {[
                { href: `/products?category=${CategoryEnum.SAREES}`, label: "Sarees", emoji: "🥻" },
                { href: `/products?category=${CategoryEnum.BANARASI_SAREES}`, label: "Banarasi Sarees", emoji: "✨" },
                { href: `/products?category=${CategoryEnum.LEHENGA}`, label: "Lehenga", emoji: "👗" },
                { href: `/products?category=${CategoryEnum.RAJPUTI_POSHAK}`, label: "Rajputi Poshak", emoji: "👘" },
                { href: `/products?category=${CategoryEnum.BRIDAL_LEHENGA}`, label: "Bridal Lehenga", emoji: "💍" },
              ].map(({ href, label, emoji }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-poppins text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 border-t border-gray-100" />

          {/* Other nav links */}
          <div className="px-4 pb-4">
            <div className="mb-2 px-3">
              <p className="text-[10px] font-poppins font-semibold text-gray-400 uppercase tracking-widest">Explore</p>
            </div>
            <div className="space-y-1">
              {[
                { href: ROUTES.SHOP, label: "All Products", emoji: "🛍️" },
                { href: ROUTES.SALE, label: "Sale", emoji: "🏷️" },
                { href: ROUTES.TRENDING, label: "Trending Collection", emoji: "🔥" },
                { href: ROUTES.TRACK_ORDER, label: "Track Order", emoji: "📦" },
              ].map(({ href, label, emoji }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-poppins text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom footer strip */}
        <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.WISHLIST}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-rose-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[10px] font-poppins">Wishlist</span>
              </Link>
              <Link
                href={ROUTES.CART}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 text-gray-500 hover:text-rose-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-[10px] font-poppins">Cart</span>
              </Link>
            </div>

            {isAuth ? (
              <button
                onClick={() => { clearAuth(); setIsMobileMenuOpen(false); router.push(ROUTES.HOME); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold font-poppins hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-semibold font-poppins shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onKeyDown={(e) => { if (e.key === "Escape") { setIsSearchOpen(false); setSearchQuery(""); } }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
        />

        {/* Search panel — slides down from top */}
        <div className={`relative bg-white shadow-2xl transition-transform duration-300 ${isSearchOpen ? "translate-y-0" : "-translate-y-4"}`}>
          <div className="container-fluid py-5 sm:py-6">

            {/* Row: input + search button + close */}
            <form
              className="flex items-center gap-2 sm:gap-3"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const trimmed = searchQuery.trim();
                if (!trimmed) return;
                setIsSearchOpen(false);
                setSearchQuery("");
                router.push(ROUTES.SEARCH(trimmed));
              }}
            >
              {/* Input */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={isSearchOpen}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-sm sm:text-base font-poppins bg-gray-50 focus:bg-white transition-all placeholder-transparent"
                />
                {searchQuery === "" && (
                  <div className="absolute left-11 sm:left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-poppins pointer-events-none">
                    <TypingPlaceholder texts={SEARCH_PLACEHOLDERS} interval={3000} typingSpeed={50} />
                  </div>
                )}
                {searchQuery !== "" && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
                    aria-label="Clear input"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="flex-shrink-0 flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold font-poppins shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                aria-label="Close search"
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-poppins text-gray-400 mr-1">Popular:</span>
              {["Banarasi Saree", "Bridal Lehenga", "Rajputi Poshak", "Silk Saree", "Party Wear"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    router.push(ROUTES.SEARCH(tag));
                  }}
                  className="px-3 py-1 text-xs font-poppins bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 rounded-full border border-gray-200 hover:border-rose-200 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
