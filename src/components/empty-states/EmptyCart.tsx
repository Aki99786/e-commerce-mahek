"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLoginUrl } from "@/lib/auth-utils";

interface EmptyCartProps {
  isAuthenticated?: boolean;
}

export function EmptyCart({ isAuthenticated = false }: EmptyCartProps) {
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-background-light flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect
                  x="30"
                  y="40"
                  width="60"
                  height="70"
                  rx="4"
                  stroke="#FFB6C1"
                  strokeWidth="3"
                  fill="#FFF0F5"
                />
                <path
                  d="M45 40V35C45 27.268 51.268 21 59 21H61C68.732 21 75 27.268 75 35V40"
                  stroke="#FFB6C1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="50"
                  y1="65"
                  x2="70"
                  y2="65"
                  stroke="#FF69B4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-3">
            PLEASE LOG IN
          </h1>
          
          <p className="text-base text-text-secondary mb-8">
            Login to view items in your bag.
          </p>

          <Link
            href={buildLoginUrl(pathname)}
            className="inline-block px-8 py-3 bg-white text-secondary border-2 border-secondary rounded-lg font-semibold text-base hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-border-light p-8 text-center">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <rect
              x="30"
              y="40"
              width="60"
              height="70"
              rx="4"
              stroke="#FFB6C1"
              strokeWidth="3"
              fill="#FFF0F5"
            />
            <path
              d="M45 40V35C45 27.268 51.268 21 59 21H61C68.732 21 75 27.268 75 35V40"
              stroke="#FFB6C1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="50"
              y1="65"
              x2="70"
              y2="65"
              stroke="#FF69B4"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary mb-2">
        Hey, it feels so light!
      </h2>
      
      <p className="text-sm text-text-secondary mb-6">
        There is nothing in your bag. Let&apos;s add some items.
      </p>

      <Link
        href="/wishlist"
        className="inline-block px-6 py-2.5 bg-white text-secondary border-2 border-secondary rounded-lg font-semibold text-sm hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
      >
        ADD ITEMS FROM WISHLIST
      </Link>
    </div>
  );
}
