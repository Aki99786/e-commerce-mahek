import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  WishlistResponse,
  AddToWishlistRequest,
  MoveToCartRequest,
  BulkMoveToCartRequest,
} from "../types";

class WishlistService extends BaseService {
  async getWishlist(): Promise<WishlistResponse> {
    return this.get<WishlistResponse>(API_ENDPOINTS.WISHLIST.LIST);
  }

  async addToWishlist(data: AddToWishlistRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.WISHLIST.ADD, data);
  }

  async removeFromWishlist(productId: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.WISHLIST.REMOVE, { productId });
  }

  async moveToCart(data: MoveToCartRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.WISHLIST.MOVE_TO_CART, data);
  }

  async bulkMoveToCart(data: BulkMoveToCartRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.WISHLIST.BULK_MOVE_TO_CART, data);
  }

  async getWishlistCount(): Promise<number> {
    try {
      const response = await this.getWishlist();
      return response.total;
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      return 0;
    }
  }
}

export const wishlistService = new WishlistService();
