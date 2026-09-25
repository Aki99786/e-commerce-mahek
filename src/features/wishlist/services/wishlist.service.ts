import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  WishlistResponse,
  GetWishlistParams,
  AddToWishlistRequest,
  AddToWishlistInput,
  RemoveFromWishlistRequest,
  MoveToCartRequest,
  BulkMoveToCartRequest,
  BulkMoveToCartResponse,
} from "../types";

class WishlistService extends BaseService {
  async getWishlist(params?: GetWishlistParams): Promise<WishlistResponse> {
    const query = new URLSearchParams();
    if (params) {
      const limit = params.limit ?? 12;
      const offset = params.offset ?? 0;

      query.set("offset", offset.toString());
      query.set("limit", limit.toString());
    }

    const qs = query.toString();
    return this.get<WishlistResponse>(
      qs ? `${API_ENDPOINTS.WISHLIST.LIST}?${qs}` : API_ENDPOINTS.WISHLIST.LIST,
    );
  }

  async addToWishlist(data: AddToWishlistInput): Promise<void> {
    let payload: AddToWishlistRequest;

    if ("wishlistItems" in data) {
      payload = data;
    } else if (Array.isArray(data)) {
      payload = { wishlistItems: data };
    } else {
      payload = {
        wishlistItems: [
          {
            productId: data.productId,
            variantId: data.variantId,
            size_id: data.size_id,
            size: data.size,
          },
        ],
      };
    }

    return this.post<void>(API_ENDPOINTS.WISHLIST.ADD, payload);
  }

  async removeFromWishlist(id: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.WISHLIST.REMOVE(id));
  }

  async moveToCart(data: {
    _id?: string;
    productId: string;
    variantId: string;
    size: string;
    size_id?: string;
    quantity?: number;
  }): Promise<BulkMoveToCartResponse> {
    return this.bulkMoveToCart({
      cartItems: [
        {
          _id: data._id || "",
          productId: data.productId,
          variantId: data.variantId,
          size_id: data.size_id,
          size: data.size,
          quantity: data.quantity ?? 1,
        },
      ],
    });
  }

  async bulkMoveToCart(
    data: BulkMoveToCartRequest,
  ): Promise<BulkMoveToCartResponse> {
    return this.post<BulkMoveToCartResponse>(
      API_ENDPOINTS.WISHLIST.BULK_MOVE_TO_CART,
      data,
    );
  }

  async getWishlistCount(): Promise<number> {
    try {
      const response = await this.getWishlist();
      return response?.total ?? response?.list?.length ?? 0;
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      return 0;
    }
  }
}

export const wishlistService = new WishlistService();
