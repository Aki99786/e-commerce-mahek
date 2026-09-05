"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { productService } from "../services/product.service";
import type {
  ProductsListParams,
  FilterOptionsData,
  FilterItemOption,
  ColorFilterItem,
} from "../types";

interface ColorOption {
  color: string;
  count?: number;
}

interface ProductFiltersProps {
  onFilterChange: (filters: ProductsListParams) => void;
  filterOptions?: FilterOptionsData | null;
  availableColors?: ColorOption[];
  availableSizes?: string[];
  initialFilters?: ProductsListParams;
}

interface NormalizedItem {
  name: string;
  count?: number;
}

interface NormalizedColorItem {
  name: string;
  code: string;
  count?: number;
}

const getColorCode = (colorValue: string, fallbackHex?: string): string => {
  if (fallbackHex) return fallbackHex;
  if (!colorValue) return "#6B7280";
  const trimmed = colorValue.trim().toLowerCase();
  if (trimmed.startsWith("#")) return trimmed;

  const colorMap: Record<string, string> = {
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#10B981",
    yellow: "#FBBF24",
    pink: "#EC4899",
    purple: "#A855F7",
    orange: "#F97316",
    black: "#2B2F38",
    white: "#FFFFFF",
    gray: "#8E8E93",
    grey: "#8E8E93",
    brown: "#92400E",
    beige: "#D4C5B9",
    gold: "#FFD700",
    silver: "#C0C0C0",
    maroon: "#800000",
    navy: "#000080",
    teal: "#0D9488",
    olive: "#808000",
    lime: "#84CC16",
    cyan: "#06B6D4",
    magenta: "#D946EF",
    indigo: "#6366F1",
    violet: "#8B5CF6",
  };

  return colorMap[trimmed] || trimmed;
};

const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

const toggleMultiSelect = (currentVal: string | undefined, item: string): string | undefined => {
  const list = currentVal
    ? currentVal
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const index = list.findIndex((x) => x.toLowerCase() === item.toLowerCase());
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(item);
  }
  return list.length > 0 ? list.join(",") : undefined;
};

const isItemSelected = (currentVal: string | undefined, item: string): boolean => {
  if (!currentVal) return false;
  const list = currentVal.split(",").map((s) => s.trim().toLowerCase());
  return list.includes(item.toLowerCase());
};

const normalizeList = (items?: (string | FilterItemOption)[]): NormalizedItem[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") {
      return { name: item };
    }
    return {
      name: item.name,
      count: item.count,
    };
  });
};

const normalizeColors = (items?: (string | ColorFilterItem)[]): NormalizedColorItem[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === "string") {
      return { name: item, code: getColorCode(item) };
    }
    const name = item.name || "";
    const code = item.code || item.hex || getColorCode(name);
    return { name, code, count: item.count };
  });
};

export function ProductFilters({
  onFilterChange,
  filterOptions: externalFilterOptions,
  initialFilters,
}: ProductFiltersProps) {
  const [internalOptions, setInternalOptions] = useState<FilterOptionsData | null>(null);
  const [filters, setFilters] = useState<ProductsListParams>(
    initialFilters || {
      limit: 10,
      page: 1,
    }
  );

  // Search & Expand states
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [showBrandSearch, setShowBrandSearch] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [colorSearchQuery, setColorSearchQuery] = useState("");
  const [showColorSearch, setShowColorSearch] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);

  // Fetch filter options only if not passed externally (undefined)
  useEffect(() => {
    if (externalFilterOptions !== undefined) return;

    let isMounted = true;
    const fetchOptions = async () => {
      try {
        const res = await productService.getFilterOptions();
        if (isMounted && res?.data) {
          setInternalOptions(res.data);
        }
      } catch (error) {
        console.error("Error fetching filter options in ProductFilters:", error);
      }
    };

    fetchOptions();
    return () => {
      isMounted = false;
    };
  }, [externalFilterOptions]);

  const options: FilterOptionsData = useMemo(() => {
    return (
      externalFilterOptions ||
      internalOptions || {
        brands: [],
        categories: [],
        fabrics: [],
        colors: [],
        sizes: [],
        price: { min: 0, max: 10000 },
      }
    );
  }, [externalFilterOptions, internalOptions]);

  // Synchronize internal filter state with external initialFilters (e.g. from URL)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Price slider state
  const minLimit = options.price?.min ?? 0;
  const maxLimit = options.price?.max ?? 10000;

  const [sliderMin, setSliderMin] = useState<number>(
    filters.minPrice !== undefined ? filters.minPrice : minLimit
  );
  const [sliderMax, setSliderMax] = useState<number>(
    filters.maxPrice !== undefined ? filters.maxPrice : maxLimit
  );

  // Sync slider bounds when options or filters change
  useEffect(() => {
    if (filters.minPrice !== undefined) {
      setSliderMin(filters.minPrice);
    } else {
      setSliderMin(minLimit);
    }

    if (filters.maxPrice !== undefined) {
      setSliderMax(filters.maxPrice);
    } else {
      setSliderMax(maxLimit);
    }
  }, [filters.minPrice, filters.maxPrice, minLimit, maxLimit]);

  // Debounced notification to parent on price change
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const notifyPriceChange = (newMin: number, newMax: number) => {
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    priceDebounceRef.current = setTimeout(() => {
      const minParam = newMin > minLimit ? newMin : undefined;
      const maxParam = newMax < maxLimit ? newMax : undefined;

      const updated = {
        ...filters,
        minPrice: minParam,
        maxPrice: maxParam,
        page: 1,
      };
      setFilters(updated);
      onFilterChange(updated);
    }, 350);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), sliderMax - 10);
    setSliderMin(value);
    notifyPriceChange(value, sliderMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), sliderMin + 10);
    setSliderMax(value);
    notifyPriceChange(sliderMin, value);
  };

  // Helper to trigger filter changes
  const updateFilter = (key: keyof ProductsListParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    setSliderMin(minLimit);
    setSliderMax(maxLimit);

    setBrandSearchQuery("");
    setShowBrandSearch(false);
    setShowAllBrands(false);

    setCategorySearchQuery("");
    setShowCategorySearch(false);
    setShowAllCategories(false);

    setColorSearchQuery("");
    setShowColorSearch(false);
    setShowAllColors(false);

    const cleared: ProductsListParams = {
      limit: filters.limit || 10,
      page: 1,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  // Normalized and filtered Brand list
  const normalizedBrands = useMemo(() => normalizeList(options.brands), [options.brands]);
  const filteredBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return normalizedBrands;
    return normalizedBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
    );
  }, [normalizedBrands, brandSearchQuery]);
  const visibleBrands = showAllBrands || brandSearchQuery.trim()
    ? filteredBrands
    : filteredBrands.slice(0, 8);

  // Normalized and filtered Category list
  const normalizedCategories = useMemo(() => normalizeList(options.categories), [options.categories]);
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return normalizedCategories;
    return normalizedCategories.filter((c) =>
      c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [normalizedCategories, categorySearchQuery]);
  const visibleCategories = showAllCategories || categorySearchQuery.trim()
    ? filteredCategories
    : filteredCategories.slice(0, 7);

  // Normalized and filtered Color list
  const normalizedColors = useMemo(() => normalizeColors(options.colors), [options.colors]);
  const filteredColors = useMemo(() => {
    if (!colorSearchQuery.trim()) return normalizedColors;
    return normalizedColors.filter((c) =>
      c.name.toLowerCase().includes(colorSearchQuery.toLowerCase())
    );
  }, [normalizedColors, colorSearchQuery]);
  const visibleColors = showAllColors || colorSearchQuery.trim()
    ? filteredColors
    : filteredColors.slice(0, 7);

  // Slider track percentages
  const safeRange = maxLimit > minLimit ? maxLimit - minLimit : 1;
  const minPercent = Math.min(100, Math.max(0, ((sliderMin - minLimit) / safeRange) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((sliderMax - minLimit) / safeRange) * 100));

  return (
    <div className="w-full text-text-primary">
      {/* 1. FILTERS Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-200">
        <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase">
          FILTERS
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs font-bold text-[#ff3f6c] hover:text-[#e02d57] uppercase tracking-wider transition-colors"
        >
          CLEAR ALL
        </button>
      </div>

      {/* 2. CATEGORIES */}
      {options.categories && options.categories.length > 0 && (
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
              CATEGORIES
            </h4>
            <button
              type="button"
              onClick={() => setShowCategorySearch(!showCategorySearch)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Toggle category search"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>

          {showCategorySearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for Category"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-[#f4f4f5] border border-transparent rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setCategorySearchQuery("");
                  setShowCategorySearch(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close category search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            className={`space-y-2.5 ${
              showAllCategories || categorySearchQuery.trim()
                ? "max-h-60 overflow-y-auto pr-1"
                : ""
            }`}
          >
            {visibleCategories.map((cat) => {
              const isSelected = isItemSelected(filters.category, cat.name);
              return (
                <label
                  key={cat.name}
                  className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      updateFilter("category", toggleMultiSelect(filters.category, cat.name))
                    }
                    className="w-4 h-4 rounded-[3px] border-gray-300 text-[#ff3f6c] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ff3f6c]"
                  />
                  <span className="text-sm text-gray-800 group-hover:text-black transition-colors capitalize">
                    {cat.name}
                  </span>
                  {cat.count !== undefined && (
                    <span className="text-xs text-gray-400 font-normal">
                      ({cat.count})
                    </span>
                  )}
                </label>
              );
            })}
            {filteredCategories.length === 0 && (
              <p className="text-xs text-gray-400 py-1">No categories found</p>
            )}
          </div>

          {filteredCategories.length > 7 && !categorySearchQuery.trim() && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="mt-2 text-xs font-semibold text-[#ff3f6c] hover:text-[#e02d57] transition-colors inline-block"
            >
              {showAllCategories ? "Show less" : `+ ${filteredCategories.length - 7} more`}
            </button>
          )}
        </div>
      )}

      {/* 3. BRAND */}
      {options.brands && options.brands.length > 0 && (
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
              BRAND
            </h4>
            <button
              type="button"
              onClick={() => setShowBrandSearch(!showBrandSearch)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Toggle brand search"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>

          {showBrandSearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for Brand"
                value={brandSearchQuery}
                onChange={(e) => setBrandSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-[#f4f4f5] border border-transparent rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setBrandSearchQuery("");
                  setShowBrandSearch(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close brand search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            className={`space-y-2.5 ${
              showAllBrands || brandSearchQuery.trim()
                ? "max-h-60 overflow-y-auto pr-1"
                : ""
            }`}
          >
            {visibleBrands.map((brand) => {
              const isSelected = isItemSelected(filters.brand, brand.name);
              return (
                <label
                  key={brand.name}
                  className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      updateFilter("brand", toggleMultiSelect(filters.brand, brand.name))
                    }
                    className="w-4 h-4 rounded-[3px] border-gray-300 text-[#ff3f6c] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ff3f6c]"
                  />
                  <span className="text-sm text-gray-800 group-hover:text-black transition-colors">
                    {brand.name}
                  </span>
                  {brand.count !== undefined && (
                    <span className="text-xs text-gray-400 font-normal">
                      ({brand.count})
                    </span>
                  )}
                </label>
              );
            })}
            {filteredBrands.length === 0 && (
              <p className="text-xs text-gray-400 py-1">No brands found</p>
            )}
          </div>

          {filteredBrands.length > 8 && !brandSearchQuery.trim() && (
            <button
              type="button"
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="mt-2 text-xs font-semibold text-[#ff3f6c] hover:text-[#e02d57] transition-colors inline-block"
            >
              {showAllBrands ? "Show less" : `+ ${filteredBrands.length - 8} more`}
            </button>
          )}
        </div>
      )}

      {/* 4. PRICE */}
      <div className="py-5 border-b border-gray-200">
        <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase mb-4">
          PRICE
        </h4>

        {/* Dual Range Track */}
        <div className="relative w-full h-7 flex items-center select-none px-1">
          {/* Light Gray Base Track */}
          <div className="absolute left-1 right-1 h-[3px] bg-gray-200 rounded-full" />

          {/* Active Pink Track */}
          <div
            className="absolute h-[3px] bg-[#ff3f6c] rounded-full pointer-events-none"
            style={{
              left: `calc(4px + ${minPercent * 0.94}%)`,
              width: `${Math.max(0, (maxPercent - minPercent) * 0.94)}%`,
            }}
          />

          {/* Min Handle Range Input */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={10}
            value={sliderMin}
            onChange={handleMinChange}
            className="dual-slider-input absolute inset-x-0 w-full z-20 cursor-pointer"
            aria-label="Minimum price"
          />

          {/* Max Handle Range Input */}
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            step={10}
            value={sliderMax}
            onChange={handleMaxChange}
            className="dual-slider-input absolute inset-x-0 w-full z-20 cursor-pointer"
            aria-label="Maximum price"
          />
        </div>

        {/* Price Value in Myntra / modern fashion style: ₹200 - ₹10,200+ */}
        <div className="mt-2.5 font-bold text-sm text-gray-900">
          ₹{formatIndianCurrency(sliderMin)} - ₹{formatIndianCurrency(sliderMax)}+
        </div>
      </div>

      {/* 5. COLOR */}
      {options.colors && options.colors.length > 0 && (
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
              COLOR
            </h4>
            <button
              type="button"
              onClick={() => setShowColorSearch(!showColorSearch)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              aria-label="Toggle color search"
            >
              <Search className="w-3 h-3" />
            </button>
          </div>

          {showColorSearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for Color"
                value={colorSearchQuery}
                onChange={(e) => setColorSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-[#f4f4f5] border border-transparent rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setColorSearchQuery("");
                  setShowColorSearch(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close color search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Color List */}
          <div
            className={`space-y-2.5 ${
              showAllColors || colorSearchQuery.trim()
                ? "max-h-60 overflow-y-auto pr-1"
                : ""
            }`}
          >
            {visibleColors.map((colorItem) => {
              const isSelected = isItemSelected(filters.color, colorItem.name);

              return (
                <label
                  key={colorItem.name}
                  className="flex items-center gap-2.5 cursor-pointer group select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      updateFilter("color", toggleMultiSelect(filters.color, colorItem.name))
                    }
                    className="w-4 h-4 rounded-[3px] border-gray-300 text-[#ff3f6c] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ff3f6c]"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: colorItem.code }}
                  />
                  <span className="text-sm text-gray-800 group-hover:text-black transition-colors capitalize">
                    {colorItem.name}
                  </span>
                  {colorItem.count !== undefined && (
                    <span className="text-xs text-gray-400 font-normal">
                      ({colorItem.count})
                    </span>
                  )}
                </label>
              );
            })}
            {filteredColors.length === 0 && (
              <p className="text-xs text-gray-400 py-1">No colors found</p>
            )}
          </div>

          {/* Show More / Show Less */}
          {filteredColors.length > 7 && !colorSearchQuery.trim() && (
            <button
              type="button"
              onClick={() => setShowAllColors(!showAllColors)}
              className="mt-2 text-xs font-semibold text-[#ff3f6c] hover:text-[#e02d57] transition-colors inline-block"
            >
              {showAllColors ? "Show less" : `+ ${filteredColors.length - 7} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
