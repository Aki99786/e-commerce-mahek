"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLoginUrl } from "@/lib/auth-utils";

interface EmptyWishlistProps {
  isAuthenticated?: boolean;
}

export function EmptyWishlist({ isAuthenticated = false }: EmptyWishlistProps) {
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your Wishlist
          </h1>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">
            Log in to save your favourite items and access them anytime.
          </p>

          <Link
            href={buildLoginUrl(pathname)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Wishlist is Empty
      </h2>
      <p className="text-sm text-gray-500 mb-7 max-w-xs mx-auto leading-relaxed">
        Save items you love here. Review them anytime and move them to your bag easily.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Start Shopping
      </Link>
    </div>
  );
}
