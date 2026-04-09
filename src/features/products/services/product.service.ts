import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Product,
  ProductsListResponse,
  ProductsListParams,
} from "../types";

class ProductService extends BaseService {
  private buildQueryString(params: ProductsListParams): string {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append("type", params.type);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.color) queryParams.append("color", params.color);
    if (params.size) queryParams.append("size", params.size);
    if (params.availability)
      queryParams.append("availability", params.availability);
    if (params.page) queryParams.append("page", params.page.toString());

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  }
  async getProductsList(
    params: ProductsListParams = {},
  ): Promise<ProductsListResponse> {
    const queryString = this.buildQueryString(params);
    return this.get<ProductsListResponse>(
      `${API_ENDPOINTS.PRODUCTS.LIST}${queryString}`,
    );
  }

  async getProductById(id: string): Promise<Product> {
    return this.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  }

  async getBestSellingProducts(): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(API_ENDPOINTS.PRODUCTS.BEST_SELLING);
  }

  async getTrendingProducts(): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(API_ENDPOINTS.PRODUCTS.TRENDING);
  }

  async getFlashSaleProducts(): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(API_ENDPOINTS.PRODUCTS.FLASH_SALE);
  }

  async getLehengasProducts(): Promise<ProductsListResponse> {
    return this.get<ProductsListResponse>(API_ENDPOINTS.PRODUCTS.LEHENGAS);
  }

  async getTestimonials(): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(
      API_ENDPOINTS.PRODUCTS.TESTIMONIALS,
    );
  }
}

export const productService = new ProductService();
