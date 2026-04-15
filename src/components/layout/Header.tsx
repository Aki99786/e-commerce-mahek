"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES, CATEGORY_ROUTES } from "@/constants/routes";
import { TypingPlaceholder } from "@/components/ui/TypingPlaceholder";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { isAuthenticated } from "@/lib/auth-utils";
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
                <Link href={CATEGORY_ROUTES.SAREES} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Sarees
                </Link>
                <Link href={CATEGORY_ROUTES.BANARASI_SAREES} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Banarasi Sarees
                </Link>
                <Link href={CATEGORY_ROUTES.LEHENGA} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Lehanga
                </Link>
                <Link href={CATEGORY_ROUTES.RAJPUTI_POSHAK} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
                  Rajputi Poshak
                </Link>
                <Link href={CATEGORY_ROUTES.BRIDAL_LEHENGA} className="block px-4 py-2 text-sm hover:bg-background-gray transition-colors">
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

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <Link href={ROUTES.HOME} onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/images/mahek_sarees_logo.svg"
                  alt="Mahek Sarees"
                  width={44}
                  height={44}
                  className="w-11 h-11"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="text-text-primary p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">
              <Link
                href={ROUTES.HOME}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-medium font-poppins text-text-primary hover:text-primary border-b border-border-light transition-colors"
              >
                Home
              </Link>
              <div className="border-b border-border-light">
                <p className="py-3 text-sm font-semibold font-poppins text-text-secondary uppercase tracking-wide">Shop</p>
                <div className="pl-3 flex flex-col gap-1 pb-3">
                  <Link href={CATEGORY_ROUTES.SAREES} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-poppins text-text-primary hover:text-primary transition-colors">Sarees</Link>
                  <Link href={CATEGORY_ROUTES.BANARASI_SAREES} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-poppins text-text-primary hover:text-primary transition-colors">Banarasi Sarees</Link>
                  <Link href={CATEGORY_ROUTES.LEHENGA} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-poppins text-text-primary hover:text-primary transition-colors">Lehanga</Link>
                  <Link href={CATEGORY_ROUTES.RAJPUTI_POSHAK} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-poppins text-text-primary hover:text-primary transition-colors">Rajputi Poshak</Link>
                  <Link href={CATEGORY_ROUTES.BRIDAL_LEHENGA} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-poppins text-text-primary hover:text-primary transition-colors">Bridal Lehanga</Link>
                </div>
              </div>
              <Link
                href={ROUTES.SHOP}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-medium font-poppins text-text-primary hover:text-primary border-b border-border-light transition-colors"
              >
                Products
              </Link>
              <Link
                href={ROUTES.SALE}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-medium font-poppins text-text-primary hover:text-primary border-b border-border-light transition-colors"
              >
                Sale
              </Link>
              <Link
                href={ROUTES.TRENDING}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-medium font-poppins text-text-primary hover:text-primary border-b border-border-light transition-colors"
              >
                Trending Collection
              </Link>
              <Link
                href={ROUTES.TRACK_ORDER}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-medium font-poppins text-text-primary hover:text-primary border-b border-border-light transition-colors"
              >
                Track Order
              </Link>
            </nav>
          </div>
        </>
      )}

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl p-4 md:p-8 z-40 border-t border-border-light">
          <div className="container-fluid">
            <button
              className="absolute top-3 right-3 md:top-6 md:right-6 text-text-secondary hover:text-primary transition-colors z-10"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <form
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 max-w-2xl mx-auto w-full pr-10 md:pr-0"
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const trimmed = searchQuery.trim();
                if (!trimmed) return;
                setIsSearchOpen(false);
                setSearchQuery("");
                router.push(ROUTES.SEARCH(trimmed));
              }}
            >
              <div className="flex-1 relative">
                <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-black focus:border-black text-sm font-poppins bg-white hover:bg-white transition-colors"
                />
                {searchQuery === "" && (
                  <div className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2 text-gray-400 text-xs md:text-sm font-poppins pointer-events-none">
                    <TypingPlaceholder texts={SEARCH_PLACEHOLDERS} interval={3000} typingSpeed={50} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="flex-shrink-0 px-6 md:px-8 py-3 md:py-3.5 bg-black text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-gray-900 transition-all duration-300 text-sm font-semibold font-poppins shadow-md hover:shadow-lg border border-black"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
