import type { Address } from "../types/address.types";

export const DUMMY_ADDRESSES: Address[] = [
  {
    _id: "addr_001",
    fullName: "Mahek Customer",
    phone: "9876543210",
    addressLine1: "12, Bapu Nagar, Near Lal Kothi",
    addressLine2: "Civil Lines",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    isDefault: true,
  },
  {
    _id: "addr_002",
    fullName: "Priya Sharma",
    phone: "9812345678",
    addressLine1: "Flat 4B, Sunrise Apartments, Linking Road",
    addressLine2: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: false,
  },
];
