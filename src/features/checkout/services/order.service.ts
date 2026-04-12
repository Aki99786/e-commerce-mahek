import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  CheckoutOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "../types/checkout.types";
import type { Order } from "../types/order.types";

class OrderService extends BaseService {
  async createCheckoutOrder(addressId: string): Promise<CheckoutOrderResponse> {
    return this.post<CheckoutOrderResponse>(API_ENDPOINTS.ORDERS.CHECKOUT, {
      addressId,
    });
  }

  async verifyPayment(
    data: VerifyPaymentRequest,
  ): Promise<VerifyPaymentResponse> {
    return this.post<VerifyPaymentResponse>(
      API_ENDPOINTS.ORDERS.VERIFY_PAYMENT,
      data,
    );
  }

  async getMyOrders(): Promise<Order[]> {
    const result = await this.get<Order[] | { orders: Order[] }>(
      API_ENDPOINTS.ORDERS.MY_ORDERS,
    );
    return Array.isArray(result) ? result : result.orders || [];
  }
}

export const orderService = new OrderService();
