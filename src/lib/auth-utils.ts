export const AUTH_CHANGE_EVENT = "mahek-auth-change";

export const notifyAuthChange = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("userData");
  
  return !!(token && userData);
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const getUserData = () => {
  if (typeof window === "undefined") return null;
  
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  notifyAuthChange();
};

export const buildLoginUrl = (referrer?: string): string => {
  if (!referrer) return "/login";
  
  const params = new URLSearchParams();
  params.set("referrer", referrer);
  
  return `/login?${params.toString()}`;
};

export const getRedirectUrl = (searchParams: URLSearchParams): string => {
  return searchParams.get("referrer") || "/";
};
