"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContainer } from "@/features/auth/components/AuthContainer";
import { FormInput } from "@/features/auth/components/FormInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { OtpInput } from "@/features/auth/components/OtpInput";
import { validateAuthForm, validateOtp } from "@/features/auth/utils/validation";
import { authService } from "@/features/auth/services/auth.service";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import { getRedirectUrl } from "@/lib/auth-utils";
import type { AuthFormData, FormErrors } from "@/features/auth/types";

type AuthStep = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("userData") : null;

    if (token && userData) {
      const redirectUrl = getRedirectUrl(searchParams);
      router.replace(redirectUrl);
    }
  }, [router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationErrors = validateAuthForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await authService.sendOtp({
        email: formData.email,
        name: "",
      });

      setSuccessMessage(AUTH_MESSAGES.OTP_SENT);
      setCurrentStep("otp");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to send OTP";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setErrorMessage("");
    setSuccessMessage("");

    const otpValidationError = validateOtp(otp);
    if (otpValidationError) {
      setOtpError(otpValidationError);
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyOtp({
        email: formData.email,
        otp: otp,
      });

      setSuccessMessage(AUTH_MESSAGES.OTP_VERIFIED);

      const redirectUrl = getRedirectUrl(searchParams);

      setTimeout(() => {
        router.push(redirectUrl);
      }, 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to verify OTP";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setOtpError("");
    setOtp("");
    setIsLoading(true);

    try {
      await authService.sendOtp({
        email: formData.email,
        name: "",
      });

      setSuccessMessage(AUTH_MESSAGES.OTP_SENT);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to resend OTP";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setOtp("");
    setOtpError("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.agreeToTerms
    );
  };

  return (
    <AuthContainer
      title="Login or Signup"
      subtitle=""
    >
      {currentStep === "email" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label=""
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Email Address*"
            autoComplete="email"
          />

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-border text-secondary focus:ring-secondary focus:ring-2"
            />
            <label htmlFor="agreeToTerms" className="text-sm font-poppins text-text-secondary leading-relaxed">
              By continuing, I agree to the{" "}
              <Link href="/terms" className="text-secondary font-semibold hover:underline">
                Terms of Use
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-secondary font-semibold hover:underline">
                Privacy Policy
              </Link>{" "}
              and I am above 18 years old.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm font-poppins text-red-600 -mt-2">{errors.agreeToTerms}</p>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-poppins text-red-600">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-poppins text-green-600">{successMessage}</p>
            </div>
          )}

          <AuthButton
            type="submit"
            isLoading={isLoading}
            disabled={!isFormValid() || isLoading}
          >
            CONTINUE
          </AuthButton>

          <div className="text-center">
            <p className="text-sm font-poppins text-text-secondary">
              Have trouble logging in?{" "}
              <Link
                href="/help"
                className="text-secondary font-semibold hover:underline"
              >
                Get help
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-5">
            <p className="text-sm font-poppins text-gray-500 mb-2">We&apos;ve sent a 6-digit OTP to</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-sm font-semibold font-poppins text-rose-700">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {formData.email}
            </span>
          </div>

          <OtpInput
            value={otp}
            onChange={setOtp}
            error={otpError}
            disabled={isLoading}
          />

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-poppins text-red-600">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-poppins text-green-600">{successMessage}</p>
            </div>
          )}

          <AuthButton
            type="button"
            onClick={handleVerifyOtp}
            isLoading={isLoading}
            disabled={otp.length !== 6 || isLoading}
          >
            {!isLoading && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            VERIFY OTP
          </AuthButton>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="flex items-center gap-1 text-xs font-poppins font-semibold text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-40"
              disabled={isLoading}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change Email
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="flex items-center gap-1 text-xs font-poppins font-semibold text-rose-600 hover:text-rose-700 transition-colors disabled:opacity-40"
              disabled={isLoading}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </AuthContainer>
  );
}
