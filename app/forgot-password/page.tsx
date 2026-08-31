"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { AuthContainer } from "@/features/auth/components/AuthContainer";
import { FormInput } from "@/features/auth/components/FormInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { validateForgotPasswordForm } from "@/features/auth/utils/validation";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import type { ForgotPasswordFormData, FormErrors } from "@/features/auth/types";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForgotPasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Password reset requested for:", formData.email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  if (isSuccess) {
    return (
      <AuthContainer
        title="Check Your Email"
        subtitle="Password reset instructions sent"
      >
        <div className="text-center space-y-7">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10 text-success"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-text-primary">
              {AUTH_MESSAGES.PASSWORD_RESET_SENT}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-semibold text-secondary">{formData.email}</span>
            </p>
          </div>

          <div className="pt-2">
            <AuthButton className="bg-[#7d1f3e]" 
              onClick={() => window.location.href = '/login'}
              type="button"
            >
              Back to Login
            </AuthButton>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-secondary">or</span>
            </div>
          </div>

          <p className="text-sm text-text-secondary">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ email: "" });
              }}
              className="text-secondary font-semibold hover:text-secondary-dark transition-colors underline-offset-2 hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary/5 border-2 border-secondary/20 rounded-lg p-5 mb-2">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-text-primary leading-relaxed">
              Enter the email address associated with your account and we&apos;ll
              send you a link to reset your password.
            </p>
          </div>
        </div>

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email address"
          autoComplete="email"
        />

        <AuthButton 
          className="bg-[#7d1f3e]" 
          type="submit" 
          isLoading={isLoading}
          disabled={!isFormValid() || isLoading}
        >
          Send Reset Link
        </AuthButton>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-text-secondary">or</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors inline-flex items-center gap-2 underline-offset-2 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Login
          </Link>
        </div>
      </form>
    </AuthContainer>
  );
}
