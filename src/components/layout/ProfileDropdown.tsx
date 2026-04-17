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

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="text-text-primary hover:text-primary transition-colors"
        aria-label="Account"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 bg-white shadow-2xl rounded-lg border border-border-light overflow-hidden z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-3 border-b border-border-light">
            <h3 className="text-base font-playfair font-bold text-primary">
              Hello {userData.name}
            </h3>
            <p className="text-xs font-poppins text-text-secondary mt-0.5">
              {userData.email}
            </p>
          </div>

          <div className="py-2 max-h-80 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-light transition-colors group"
                >
                  <Icon className="w-4 h-4 text-text-secondary group-hover:text-secondary transition-colors" />
                  <span className="text-sm font-poppins text-text-primary group-hover:text-secondary transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border-light py-2">
            <Link
              href="/profile/edit"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-light transition-colors group"
            >
              <Edit className="w-4 h-4 text-text-secondary group-hover:text-secondary transition-colors" />
              <span className="text-sm font-poppins text-text-primary group-hover:text-secondary transition-colors">
                Edit Profile
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-4 h-4 text-text-secondary group-hover:text-red-600 transition-colors" />
              <span className="text-sm font-poppins text-text-primary group-hover:text-red-600 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
