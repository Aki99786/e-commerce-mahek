import { BaseService } from "@/lib/base-service";
import { API_ENDPOINTS } from "@/lib/api-config";
import type {
  Address,
  AddressFormData,
  AddressListResponse,
} from "../types/address.types";

class AddressService extends BaseService {
  async getAddresses(): Promise<Address[]> {
    const response = await this.get<AddressListResponse>(
      API_ENDPOINTS.ADDRESS.LIST,
    );
    return response.addresses || [];
  }

  async addAddress(data: AddressFormData): Promise<Address> {
    return this.post<Address>(API_ENDPOINTS.ADDRESS.ADD, data);
  }

  async updateAddress(
    id: string,
    data: Partial<AddressFormData>,
  ): Promise<Address> {
    return this.put<Address>(API_ENDPOINTS.ADDRESS.UPDATE(id), data);
  }

  async deleteAddress(id: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.ADDRESS.DELETE(id));
  }
}

export const addressService = new AddressService();
