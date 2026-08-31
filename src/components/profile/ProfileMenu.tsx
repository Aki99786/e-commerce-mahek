"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserData, clearAuth } from "@/lib/auth-utils";
import { User, Heart, ShoppingBag, Gift, Phone, CreditCard, MapPin, Edit, LogOut } from "lucide-react";

interface ProfileMenuProps {
  activeTab?: "profile" | "wishlist" | "bag";
}

export function ProfileMenu({ activeTab = "profile" }: ProfileMenuProps) {
  const router = useRouter();
  const userData = getUserData();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (!userData) {
    return null;
  }

  const menuSections = [
    {
      items: [
        { label: "Orders", href: "/orders", icon: ShoppingBag },
        { label: "Wishlist", href: "/wishlist", icon: Heart },
        { label: "Gift Cards", href: "/gift-cards", icon: Gift },
        { label: "Contact Us", href: "/contact", icon: Phone },
      ],
    },
    {
      items: [
        { label: "Coupons", href: "/coupons", icon: CreditCard },
        { label: "Saved Cards", href: "/saved-cards", icon: CreditCard },
        { label: "Saved Addresses", href: "/saved-addresses", icon: MapPin },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
      <div className="flex items-center gap-4 border-b border-border-light">
        <Link
          href="/profile"
          className={`flex-1 flex flex-col items-center gap-2 py-4 transition-colors ${
            activeTab === "profile"
              ? "text-secondary border-b-2 border-secondary"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-semibold">Profile</span>
        </Link>
        <Link
          href="/wishlist"
          className={`flex-1 flex flex-col items-center gap-2 py-4 transition-colors ${
            activeTab === "wishlist"
              ? "text-secondary border-b-2 border-secondary"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm font-semibold">Wishlist</span>
        </Link>
        <Link
          href="/cart"
          className={`flex-1 flex flex-col items-center gap-2 py-4 transition-colors ${
            activeTab === "bag"
              ? "text-secondary border-b-2 border-secondary"
              : "text-text-secondary hover:text-primary"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-sm font-semibold">Bag</span>
        </Link>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-1">
            Hello {userData.name}
          </h2>
          <p className="text-sm text-text-secondary">
            {userData.email}
          </p>
        </div>

        {menuSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className={`${
              sectionIndex < menuSections.length - 1
                ? "border-b border-border-light pb-4 mb-4"
                : "pb-4"
            }`}
          >
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-background-light transition-colors group"
                >
                  <Icon className="w-5 h-5 text-text-secondary group-hover:text-secondary transition-colors" />
                  <span className="text-base text-text-primary group-hover:text-secondary transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}

        <div className="border-t border-border-light pt-4">
          <Link
            href="/profile/edit"
            className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-background-light transition-colors group mb-2"
          >
            <Edit className="w-5 h-5 text-text-secondary group-hover:text-secondary transition-colors" />
            <span className="text-base text-text-primary group-hover:text-secondary transition-colors">
              Edit Profile
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-text-secondary group-hover:text-red-600 transition-colors" />
            <span className="text-base text-text-primary group-hover:text-red-600 transition-colors">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
