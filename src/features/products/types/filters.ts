export enum SortOption {
  LATEST = "latest",
  PRICE_LOW = "price-low",
  PRICE_HIGH = "price-high",
  RATING = "rating",
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  colors: string[];
  sizes: string[];
  bundles: string[];
  countryOfOrigin: string[];
  sortBy: SortOption;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface SizeOption {
  id: string;
  label: string;
}
