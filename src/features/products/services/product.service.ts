import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Product,
  ProductsListResponse,
  ProductsListParams,
  TestimonialsResponse,
  FilterOptionsResponse,
} from "../types";

class ProductService extends BaseService {
  private buildQueryString(params: ProductsListParams): string {
    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append("category", params.category);
    if (params.subCategory)
      queryParams.append("subCategory", params.subCategory);
    if (params.brand) queryParams.append("brand", params.brand);
    if (params.type) queryParams.append("type", params.type);
    if (params.color) queryParams.append("color", params.color);
    if (params.size) queryParams.append("size", params.size);
    if (params.fabric) queryParams.append("fabric", params.fabric);
    if (params.pattern) queryParams.append("pattern", params.pattern);
    if (params.minPrice !== undefined)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.availability)
      queryParams.append("availability", params.availability);
    if (params.isFeatured !== undefined)
      queryParams.append("isFeatured", params.isFeatured.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());

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

  async getTestimonials(): Promise<TestimonialsResponse> {
    return this.get<TestimonialsResponse>(API_ENDPOINTS.PRODUCTS.TESTIMONIALS);
  }

  private filterOptionsPromise: Promise<FilterOptionsResponse> | null = null;

  async getFilterOptions(): Promise<FilterOptionsResponse> {
    if (!this.filterOptionsPromise) {
      this.filterOptionsPromise = this.get<FilterOptionsResponse>(
        API_ENDPOINTS.PRODUCTS.FILTER_OPTIONS
      ).catch((err) => {
        this.filterOptionsPromise = null;
        throw err;
      });
    }
    return this.filterOptionsPromise;
  }
}

export const productService = new ProductService();
