import { toast } from "./toast";
import { clearAuth, isAuthenticated } from "./auth-utils";

type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: Error) => void | Promise<void>;

interface RequestConfig extends RequestInit {
  url: string;
  /**
   * When true, a 401 does not clear the local session or redirect to /login.
   * Used for calls that are valid for guests (cart, wishlist, products).
   */
  skipAuthRedirect?: boolean;
}

interface ApiClientConfig {
  baseURL?: string;
  headers?: HeadersInit;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Header that satisfies the API's CSRF guard for cookie-authenticated requests. */
export const CSRF_HEADERS = { "X-Requested-With": "XMLHttpRequest" } as const;

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig = {}) {
    this.baseURL =
      config.baseURL || (process.env.NEXT_PUBLIC_API_URL as string);
    this.defaultHeaders = config.headers || {};
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  private async applyRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  private async applyResponseInterceptors(
    response: Response,
  ): Promise<Response> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  private async applyErrorInterceptors(error: Error): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
  }

  async request<T = unknown>(
    url: string,
    config: RequestConfig | RequestInit = {},
  ): Promise<T> {
    try {
      const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

      let requestConfig: RequestConfig = {
        ...config,
        url: fullUrl,
        // Session lives in an httpOnly cookie; always send it.
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...CSRF_HEADERS,
          ...this.defaultHeaders,
          ...config.headers,
        },
      };

      requestConfig = await this.applyRequestInterceptors(requestConfig);

      const { url: finalUrl, skipAuthRedirect, ...fetchConfig } = requestConfig;
      let response = await fetch(finalUrl, fetchConfig);

      response = await this.applyResponseInterceptors(response);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
        }));
        const apiError = new ApiError(
          error.message || `Request failed with status ${response.status}`,
          response.status,
        );

        // Session expired or revoked: drop local user data and go to login,
        // but only when the caller was acting as a logged-in user.
        if (
          response.status === 401 &&
          !skipAuthRedirect &&
          typeof window !== "undefined" &&
          isAuthenticated()
        ) {
          clearAuth();
          window.location.href = "/login";
        }

        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        await this.applyErrorInterceptors(error);
      }
      throw error;
    }
  }

  async get<T = unknown>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

const apiClient = new ApiClient();

apiClient.addErrorInterceptor((error) => {
  if (typeof window !== "undefined") {
    // 401 is handled in request(); everything else surfaces as a toast.
    if (error instanceof ApiError && error.status === 401) {
      return;
    }
    toast.handleAPIError(error);
  }
});

export default apiClient;
export { ApiClient };
export type { RequestConfig, ApiClientConfig };
