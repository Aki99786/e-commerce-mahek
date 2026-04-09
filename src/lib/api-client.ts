import { toast } from "./toast";

type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: Error) => void | Promise<void>;

interface RequestConfig extends RequestInit {
  url: string;
}

interface ApiClientConfig {
  baseURL?: string;
  headers?: HeadersInit;
}

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
    config: RequestInit = {},
  ): Promise<T> {
    try {
      const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

      let requestConfig: RequestConfig = {
        ...config,
        url: fullUrl,
        headers: {
          "Content-Type": "application/json",
          ...this.defaultHeaders,
          ...config.headers,
        },
      };

      requestConfig = await this.applyRequestInterceptors(requestConfig);

      const { url: finalUrl, ...fetchConfig } = requestConfig;
      let response = await fetch(finalUrl, fetchConfig);

      response = await this.applyResponseInterceptors(response);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
        }));
        throw new Error(
          error.message || `Request failed with status ${response.status}`,
        );
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

apiClient.addRequestInterceptor((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

apiClient.addResponseInterceptor((response) => {
  return response;
});

apiClient.addErrorInterceptor((error) => {
  if (typeof window !== "undefined") {
    // Handle 401 Unauthorized - redirect to login
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
      return;
    }

    // Show error toast for all other API errors
    toast.handleAPIError(error);
  }
});

export default apiClient;
export { ApiClient };
export type { RequestConfig, ApiClientConfig };
