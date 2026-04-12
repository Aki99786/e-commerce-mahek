import { AUTH_MESSAGES, VALIDATION_PATTERNS, OTP_LENGTH } from "../constants";
import type {
  ForgotPasswordFormData,
  FormErrors,
  AuthFormData,
} from "../types";

export const validateForgotPasswordForm = (
  data: ForgotPasswordFormData,
): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = AUTH_MESSAGES.REQUIRED_FIELD;
  } else if (!VALIDATION_PATTERNS.EMAIL.test(data.email)) {
    errors.email = AUTH_MESSAGES.INVALID_EMAIL;
  }

  return errors;
};

export const validateOtp = (otp: string): string | undefined => {
  if (!otp || otp.trim() === "") {
    return AUTH_MESSAGES.OTP_REQUIRED;
  }

  if (otp.length !== OTP_LENGTH || !/^\d{6}$/.test(otp)) {
    return AUTH_MESSAGES.INVALID_OTP;
  }

  return undefined;
};

export const validateAuthForm = (data: AuthFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = AUTH_MESSAGES.REQUIRED_FIELD;
  } else if (!VALIDATION_PATTERNS.EMAIL.test(data.email)) {
    errors.email = AUTH_MESSAGES.INVALID_EMAIL;
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms =
      "You must agree to the Terms of Use and Privacy Policy";
  }

  return errors;
};
