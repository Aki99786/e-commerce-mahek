import { BaseService } from "@/lib/base-service";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";
import { CSRF_HEADERS, ApiError } from "@/lib/api-client";
import type {
  AddReviewRequest,
  CreateReviewRequest,
  CreateReviewResponse,
  UpdateReviewRequest,
} from "../types";

export const REVIEW_IMAGE_MAX_FILES = 3;
export const REVIEW_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const REVIEW_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

class ReviewService extends BaseService {
  /**
   * Upload 1–3 review photos. Returns the stored URLs to send with the review.
   * Multipart request: the browser sets Content-Type with the boundary.
   */
  async uploadReviewImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOADS.REVIEW_IMAGES}`,
      {
        method: "POST",
        credentials: "include",
        headers: { ...CSRF_HEADERS },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: `Upload failed (${response.status})` }));
      throw new ApiError(
        error.message || `Upload failed (${response.status})`,
        response.status,
      );
    }

    const data = (await response.json()) as { urls?: string[] };
    if (!Array.isArray(data.urls) || data.urls.length === 0) {
      throw new ApiError("Upload returned no image URLs", 500);
    }
    return data.urls;
  }

  /** POST /reviews/add — the live review endpoint. */
  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    return this.post<CreateReviewResponse>(API_ENDPOINTS.REVIEWS.CREATE, data);
  }

  async addReview(productId: string, data: AddReviewRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.REVIEWS.ADD(productId), data);
  }

  async updateReview(
    productId: string,
    reviewId: string,
    data: UpdateReviewRequest,
  ): Promise<void> {
    return this.put<void>(
      API_ENDPOINTS.REVIEWS.UPDATE(productId, reviewId),
      data,
    );
  }

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.REVIEWS.DELETE(productId, reviewId));
  }
}

export const reviewService = new ReviewService();
