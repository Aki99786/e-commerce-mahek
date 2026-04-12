export type UserRole = "USER" | "ADMIN" | "MANAGER" | "SUPPORT";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SendOtpRequest {
  email: string;
  name?: string;
}

export interface SendOtpResponse {
  message: string;
  isLogin: boolean;
  userName: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  addresses: unknown[];
}

export interface VerifyOtpResponse {
  user: UserData;
  token?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AuthFormData {
  email: string;
  agreeToTerms: boolean;
}
