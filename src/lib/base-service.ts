import apiClient from "./api-client";
import { API_CONFIG } from "./api-config";

export interface ServiceError {
  message: string;
  code?: string;
  status?: number;
}

export class BaseService {
  protected readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  protected async handleRequest<T>(
    operation: string,
    request: () => Promise<T>,
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      this.handleError(operation, error);
      throw error;
    }
  }

  protected handleError(operation: string, error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error in ${operation}:`, errorMessage);
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.handleRequest(`GET ${endpoint}`, () =>
      apiClient.get<T>(endpoint),
    );
  }

  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.handleRequest(`POST ${endpoint}`, () =>
      apiClient.post<T>(endpoint, data),
    );
  }

  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.handleRequest(`PUT ${endpoint}`, () =>
      apiClient.put<T>(endpoint, data),
    );
  }

  protected async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.handleRequest(`DELETE ${endpoint}`, () =>
      apiClient.delete<T>(
        endpoint,
        data ? { body: JSON.stringify(data) } : undefined,
      ),
    );
  }
}
