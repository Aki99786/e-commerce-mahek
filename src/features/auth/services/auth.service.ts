import apiClient, { ApiError } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-config";
import { clearAuth, notifyAuthChange } from "@/lib/auth-utils";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  UserData,
} from "../types";

const STORAGE_KEYS = {
  USER_DATA: "userData",
} as const;

/**
 * Authentication is cookie based: the API sets an httpOnly `session` cookie
 * on OTP verification and clears it on logout. This service never handles
 * the token itself; it only keeps the user profile for display.
 */
class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return apiClient.post<SendOtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data, {
      skipAuthRedirect: true,
    } as RequestInit);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const result = await apiClient.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
      { skipAuthRedirect: true } as RequestInit,
    );

    if (result.user) {
      this.setUserData(result.user);
    }

    return result;
  }

  /**
   * Confirms the cookie session with the server and refreshes the stored
   * profile. Returns null (and clears local data) when the session is gone.
   */
  async me(): Promise<UserData | null> {
    try {
      const result = await apiClient.get<{ user: UserData }>(
        API_ENDPOINTS.AUTH.ME,
        { skipAuthRedirect: true } as RequestInit,
      );
      if (result?.user) {
        this.setUserData(result.user);
        return result.user;
      }
      return null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuth();
      }
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post<{ message: string }>(
        API_ENDPOINTS.AUTH.LOGOUT,
        undefined,
        { skipAuthRedirect: true } as RequestInit,
      );
    } catch {
      // Cookie may already be gone; local state is cleared regardless.
    } finally {
      clearAuth();
    }
  }

  private isClient(): boolean {
    return typeof window !== "undefined";
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
      try {
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  clearAuth(): void {
    clearAuth();
  }
}

export const authService = new AuthService();
