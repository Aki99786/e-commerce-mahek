export const AUTH_CHANGE_EVENT = "mahek-auth-change";

const USER_DATA_KEY = "userData";

export const notifyAuthChange = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

/**
 * The session itself is an httpOnly cookie the browser sends automatically.
 * Locally we only keep the user profile for display; its presence is our
 * best-effort "logged in" signal, confirmed by GET /auth/me on app load.
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(USER_DATA_KEY);
};

export const getUserData = () => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(USER_DATA_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_DATA_KEY);
  // Legacy key from the header-token era; remove if still present.
  localStorage.removeItem("authToken");
  notifyAuthChange();
};

export const buildLoginUrl = (referrer?: string): string => {
  if (!referrer) return "/login";

  const params = new URLSearchParams();
  params.set("referrer", referrer);

  return `/login?${params.toString()}`;
};

/**
 * Only same-origin paths are allowed as a post-login redirect
 * (rejects "//evil.com", absolute URLs, and anything with whitespace/control chars).
 */
export const sanitizeRedirectPath = (value: string | null | undefined): string => {
  if (!value) return "/";
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return "/";
  for (const ch of trimmed) {
    const code = ch.charCodeAt(0);
    if (code <= 0x20 || code === 0x7f) return "/";
  }
  return trimmed;
};

export const getRedirectUrl = (searchParams: URLSearchParams): string => {
  return sanitizeRedirectPath(searchParams.get("referrer"));
};
