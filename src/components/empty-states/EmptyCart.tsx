"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLoginUrl } from "@/lib/auth-utils";
import { ROUTES } from "@/constants/routes";

interface EmptyCartProps {
  isAuthenticated?: boolean;
}

export function EmptyCart({ isAuthenticated = false }: EmptyCartProps) {
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-md w-full text-center">
          {/* Icon Badge */}
          <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-rose-50/50">
            <svg
              className="w-12 h-12 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2.5 tracking-tight">
            Please Sign In
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Login to view items in your bag, manage your cart, and proceed to checkout.
          </p>

          <Link
            href={buildLoginUrl(pathname)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-md w-full text-center">
        {/* Icon Badge */}
        <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-rose-50/50">
          <svg
            className="w-12 h-12 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2.5 tracking-tight">
          Your Shopping Bag is Empty
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Looks like you haven&apos;t added any items to your bag yet. Explore our curated ethnic collection to find your favorites.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={ROUTES.PRODUCTS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Start Shopping
          </Link>

          <Link
            href={ROUTES.WISHLIST}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-700 hover:text-rose-600 border border-gray-200 hover:border-rose-300 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-200"
          >
            <svg
              className="w-4 h-4 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            View Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}
