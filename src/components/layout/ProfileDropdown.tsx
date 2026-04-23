"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserData, clearAuth } from "@/lib/auth-utils";
import { Gift, Phone, CreditCard, MapPin, Edit, LogOut, ShoppingBag } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  [key: string]: unknown;
}

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserData(getUserData() as UserData | null);

    const handleStorageChange = () => {
      setUserData(getUserData());
    };

    window.addEventListener("storage", handleStorageChange);
    
    const interval = setInterval(() => {
      setUserData(getUserData());
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push("/");
  };

  if (!userData) {
    return null;
  }

  const menuItems = [
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Gift Cards", href: "/gift-cards", icon: Gift },
    { label: "Contact Us", href: "/contact", icon: Phone },
    { label: "Coupons", href: "/coupons", icon: CreditCard },
    { label: "Saved Cards", href: "/saved-cards", icon: CreditCard },
    { label: "Saved Addresses", href: "/saved-addresses", icon: MapPin },
  ];

  const initials = userData
    ? userData.name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0]?.toUpperCase() ?? "")
        .join("")
    : "U";

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Trigger button — avatar initials on hover, icon at rest */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:ring-2 hover:ring-rose-300 overflow-hidden"
        aria-label="Account"
        aria-expanded={isOpen}
      >
        <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold font-poppins leading-none">{initials}</span>
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 origin-top-right ${
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Header — gradient band with avatar + user info */}
        <div className="bg-gradient-to-r from-[#1a0a0a] to-[#3d1515] px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold font-poppins">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-playfair font-bold text-sm leading-tight truncate">
              {userData.name}
            </p>
            <p className="text-white/60 font-poppins text-[11px] mt-0.5 truncate">
              {userData.email}
            </p>
          </div>
        </div>

        {/* Main menu items */}
        <div className="py-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="relative flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 transition-all duration-150 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-rose-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-rose-600 transition-colors" />
                </div>
                <span className="text-sm font-poppins text-gray-700 group-hover:text-rose-700 transition-colors font-medium">
                  {item.label}
                </span>
                <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100" />

        {/* Footer actions */}
        <div className="py-1.5">
          <Link
            href="/profile/edit"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-rose-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <Edit className="w-3.5 h-3.5 text-gray-500 group-hover:text-rose-600 transition-colors" />
            </div>
            <span className="text-sm font-poppins text-gray-700 group-hover:text-rose-700 transition-colors font-medium">
              Edit Profile
            </span>
            <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <LogOut className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-600 transition-colors" />
            </div>
            <span className="text-sm font-poppins text-gray-700 group-hover:text-red-600 transition-colors font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
