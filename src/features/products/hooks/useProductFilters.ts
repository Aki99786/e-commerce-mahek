"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { FilterState, SortOption } from "../types/filters";
import { DEFAULT_PRICE_RANGE } from "../constants/filters";

const ITEMS_PER_PAGE = 20;

export const useProductFilters = (allProducts: Product[]) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: DEFAULT_PRICE_RANGE,
    colors: [],
    sizes: [],
    bundles: [],
    countryOfOrigin: [],
    sortBy: SortOption.RECOMMENDED,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.categorySlug),
      );
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {
      filtered = filtered.filter(
        (product) =>
          (product.price.current ?? 0) >= filters.priceRange.min &&
          (product.price.current ?? 0) <= filters.priceRange.max,
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) =>
          filters.colors.includes(color.name.toLowerCase()),
        ),
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) =>
          filters.sizes.includes(size.name.toLowerCase()),
        ),
      );
    }

    switch (filters.sortBy) {
      case SortOption.PRICE_LOW_TO_HIGH:
        filtered.sort(
          (a, b) => (a.price.current ?? 0) - (b.price.current ?? 0),
        );
        break;
      case SortOption.PRICE_HIGH_TO_LOW:
        filtered.sort(
          (a, b) => (b.price.current ?? 0) - (a.price.current ?? 0),
        );
        break;
      case SortOption.CUSTOMER_RATING:
        filtered.sort(
          (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0),
        );
        break;
      case SortOption.BETTER_DISCOUNT:
        filtered.sort(
          (a, b) => (b.price.discount || 0) - (a.price.discount || 0),
        );
        break;
      case SortOption.WHATS_NEW:
        filtered = filtered.filter((p) => p.label?.type === "new");
        break;
      case SortOption.POPULARITY:
        filtered.sort(
          (a, b) => (b.rating?.count || 0) - (a.rating?.count || 0),
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, filters]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE,
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    filters,
    setFilters: handleFilterChange,
    currentPage,
    totalPages,
    paginatedProducts,
    totalProducts: filteredAndSortedProducts.length,
    handlePageChange,
  };
};
