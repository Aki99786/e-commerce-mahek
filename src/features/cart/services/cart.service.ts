import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";

export interface AddToCartRequest {
  productId: string;
  variantId: string;
  size: string;
  size_id?: string;
  quantity: number;
}

export interface UpdateCartRequest {
  id: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  removeids: string[];
}

export interface CartItem {
  _id: string;
  product_id: string;
  variantId: string;
  size_id: string;
  product_name: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  size: string;
  quantity: number;
  selling_price: number;
  mrp: number;
  color?: string;
}

export interface CartData {
  total: number;
  offset: number;
  limit: number;
  list: CartItem[];
}

export interface CartListResponse {
  success: boolean;
  data: CartData;
}

class CartService extends BaseService {
  async addToCart(data: AddToCartRequest): Promise<void> {
    return this.post<void>(API_ENDPOINTS.CART.ADD, data);
  }

  async updateCart(idOrData: string | UpdateCartRequest, quantity?: number): Promise<void> {
    const id = typeof idOrData === "string" ? idOrData : idOrData.id;
    const qty = typeof idOrData === "string" ? quantity ?? 1 : idOrData.quantity;
    return this.put<void>(API_ENDPOINTS.CART.UPDATE(id), { quantity: qty });
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
      const list = response?.data?.list ?? [];
      return list.reduce((total, item) => total + (item?.quantity ?? 0), 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return 0;
    }
  }
}

export const cartService = new CartService();
