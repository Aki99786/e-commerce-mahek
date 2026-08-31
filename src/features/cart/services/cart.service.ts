import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";

export interface AddToCartRequest {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export interface UpdateCartRequest {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  productId: string;
  variantId: string;
  size: string;
}

export interface CartItemProduct {
  _id: string;
  name: string;
  slug: string;
  allImages: string[];
}

export interface CartItem {
  product: CartItemProduct;
  variantId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  images?: string[];
}

export interface CartListResponse {
  items: CartItem[];
}

class CartService extends BaseService {
  async addToCart(data: AddToCartRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.CART.ADD, data);
  }

  async updateCart(data: UpdateCartRequest): Promise<void> {
    return this.put<void>(API_ENDPOINTS.CART.UPDATE, data);
  }

  async removeFromCart(data: RemoveFromCartRequest): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.CART.REMOVE, data);
  }

  async getCartList(): Promise<CartListResponse> {
    return this.get<CartListResponse>(API_ENDPOINTS.CART.LIST);
  }

  async clearCart(): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.CART.CLEAR);
  }

  async getCartCount(): Promise<number> {
    try {
      const response = await this.getCartList();
      return response.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return 0;
    }
  }
}

export const cartService = new CartService();
