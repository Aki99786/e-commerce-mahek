"use client";

import { useState, useEffect } from "react";
import { ProductsListParams } from "../types";

interface ColorOption {
  color: string;
  count: number;
}

interface ProductFiltersProps {
  onFilterChange: (filters: ProductsListParams) => void;
  availableColors?: ColorOption[];
  availableSizes?: string[];
  initialFilters?: ProductsListParams;
}

const getColorCode = (colorValue: string): string => {
  // Handle undefined or null values
  if (!colorValue) {
    return "#6B7280";
  }
  
  // If it's already a hex code, return it
  if (colorValue.startsWith("#")) {
    return colorValue;
  }
  
  // Otherwise, map color name to hex code
  const colorMap: Record<string, string> = {
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#10B981",
    yellow: "#FBBF24",
    pink: "#EC4899",
    purple: "#A855F7",
    orange: "#F97316",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#6B7280",
    grey: "#6B7280",
    brown: "#92400E",
    beige: "#D4C5B9",
    gold: "#FFD700",
    silver: "#C0C0C0",
    maroon: "#800000",
    navy: "#000080",
    teal: "#008080",
    olive: "#808000",
    lime: "#00FF00",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    indigo: "#4B0082",
    violet: "#8B00FF",
  };
  
  return colorMap[colorValue.toLowerCase()] || "#6B7280";
};


export function ProductFilters({
  onFilterChange,
  availableColors = [],
  availableSizes = [],
  initialFilters,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductsListParams>(
    initialFilters || {
      limit: 10,
      page: 1,
    }
  );
  const [colorSearchQuery, setColorSearchQuery] = useState("");

  // Update local filters when initialFilters change (from URL)
  useEffect(() => {
    if (initialFilters) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleFilterChange = (key: keyof ProductsListParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { limit: 10, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-playfair font-bold">FILTERS</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-secondary hover:underline font-poppins"
        >
          Clear All
        </button>
      </div>

      {/* Sort */}
      <div className="border-b border-border-light pb-4">
        <h4 className="font-poppins font-semibold mb-3">Sort by</h4>
        <select
          value={filters.sort || ""}
          onChange={(e) =>
            handleFilterChange(
              "sort",
              e.target.value || undefined
            )
          }
          className="w-full p-2 border border-border-light rounded-md font-poppins text-sm"
        >
          <option value="">Recommended</option>
          <option value="newest">What&apos;s New</option>
          <option value="popular">Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="border-b border-border-light pb-4">
        <h4 className="font-poppins font-semibold mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handlePriceChange(
                  e.target.value ? Number(e.target.value) : undefined,
                  filters.maxPrice
                )
              }
              className="w-full p-2 border border-border-light rounded-md font-poppins text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handlePriceChange(
                  filters.minPrice,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full p-2 border border-border-light rounded-md font-poppins text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Under ₹1000", max: 1000 },
              { label: "₹1000-₹3000", min: 1000, max: 3000 },
              { label: "₹3000-₹5000", min: 3000, max: 5000 },
              { label: "₹5000-₹10000", min: 5000, max: 10000 },
              { label: "Above ₹10000", min: 10000 },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange(range.min, range.max)}
                className={`px-3 py-1 text-xs border rounded-full font-poppins transition-colors ${
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max
                    ? "bg-secondary text-white border-secondary"
                    : "border-border-light hover:border-secondary"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      {availableColors.length > 0 && (
        <div className="border-b border-border-light pb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-poppins font-semibold uppercase text-sm">COLOR</h4>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search colors..."
              value={colorSearchQuery}
              onChange={(e) => setColorSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-border-light rounded-md font-poppins text-sm focus:outline-none focus:border-secondary"
            />
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Color List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableColors
              .filter(({ color }) => 
                color.toLowerCase().includes(colorSearchQuery.toLowerCase())
              )
              .map(({ color, count }) => {
                const bgColor = getColorCode(color);
                const isSelected = filters.color === color;
                
                return (
                  <label
                    key={color}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        handleFilterChange(
                          "color",
                          filters.color === color ? undefined : color
                        )
                      }
                      className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: bgColor }}
                    />
                    <span className="flex-1 text-sm font-poppins capitalize">
                      {color}
                    </span>
                    <span className="text-xs text-gray-400 font-poppins">
                      ({count})
                    </span>
                  </label>
                );
              })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div className="border-b border-border-light pb-4">
          <h4 className="font-poppins font-semibold mb-3">Size</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.filter(size => size).map((size) => (
              <button
                key={size}
                onClick={() =>
                  handleFilterChange(
                    "size",
                    filters.size === size ? undefined : size
                  )
                }
                className={`px-3 py-1 text-sm border rounded-md font-poppins transition-colors ${
                  filters.size === size
                    ? "bg-secondary text-white border-secondary"
                    : "border-border-light hover:border-secondary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="border-b border-border-light pb-4">
        <h4 className="font-poppins font-semibold mb-3">Availability</h4>
        <div className="space-y-2">
          {[
            { label: "In Stock", value: "inStock" as const },
            { label: "Out of Stock", value: "outOfStock" as const },
            { label: "Pre Order", value: "preOrder" as const },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option.value}
                onChange={() =>
                  handleFilterChange(
                    "availability",
                    filters.availability === option.value
                      ? undefined
                      : option.value
                  )
                }
                className="w-4 h-4 text-secondary"
              />
              <span className="text-sm font-poppins">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
