export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AddressListResponse {
  addresses: Address[];
}

export type AddressFormData = Omit<Address, "_id" | "isDefault">;
