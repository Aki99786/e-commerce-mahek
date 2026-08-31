import apiClient from "@/lib/api-client";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";
import { notifyAuthChange } from "@/lib/auth-utils";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  UserData,
} from "../types";

const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
} as const;

class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return apiClient.post<SendOtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_OTP}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to verify OTP" }));
      throw new Error(error.message || "Failed to verify OTP");
    }

    const result = await response.json();

    this.handleAuthToken(response, result);
    this.handleUserData(result);

    return result;
  }

  private handleAuthToken(response: Response, result: VerifyOtpResponse): void {
    const authHeader = response.headers.get("Authorization");

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;
      this.setAuthToken(token);
    } else if (result.token) {
      this.setAuthToken(result.token);
    }
  }

  private handleUserData(result: VerifyOtpResponse): void {
    if (result.user) {
      this.setUserData(result.user);
    }
  }

  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  setAuthToken(token: string): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      notifyAuthChange();
    }
  }

  getAuthToken(): string | null {
    if (this.isClient()) {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  }

  setUserData(userData: UserData): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      notifyAuthChange();
    }
  }

  getUserData(): UserData | null {
    if (this.isClient()) {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  clearAuth(): void {
    if (this.isClient()) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      notifyAuthChange();
    }
  }
}

export const authService = new AuthService();
