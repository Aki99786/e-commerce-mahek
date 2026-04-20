"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { isAuthenticated } from "@/lib/auth-utils";

export default function ProfilePage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);

      if (!authenticated) {
        router.push("/login?referrer=/profile");
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="flex-1 bg-background-light py-8 px-4">
      <div className="max-w-md mx-auto">
        <ProfileMenu activeTab="profile" />
      </div>
    </div>
  );
}
