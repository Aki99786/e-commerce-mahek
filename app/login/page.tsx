import type { Metadata } from "next";
import { Suspense } from "react";
import { generateSEO } from "@/lib/utils/seo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Sign In to Your Account",
    description: "Sign in to your Mahek account to view orders, manage your wishlist and access exclusive collections.",
    noIndex: true,
  }),
};


function LoginFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-text-secondary">Loading...</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
