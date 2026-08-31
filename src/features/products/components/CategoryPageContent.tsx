"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import { productService } from "../services/product.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { expandProductVariants } from "../utils/variant-expander";
import { adaptExpandedVariantToUI } from "../utils/variant-product-adapter";
import { ProductCard } from "@/components/product/ProductCard";
import { isAuthenticated } from "@/lib/auth-utils";
import type {
  Product,
  ProductsListParams,
  ProductsListResponse,
} from "../types";
import { CATEGORY_TYPE_MAP } from "../types";
import { Pagination } from "./Pagination";
import { CATEGORIES } from "@/constants/categories";
import type { ExpandedVariantProduct } from "../utils/variant-expander";
import type { WishlistItem } from "@/features/wishlist/types";

interface CategoryPageContentProps {
  categoryType?: string;
}

const filterOptionsCache = new Map<string, Product[]>();

export function CategoryPageContent({
  categoryType: categoryTypeProp,
}: CategoryPageContentProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve categoryType: prop overrides URL (backward compat), else read ?category=
  const categorySlugFromUrl = searchParams.get('category') ?? '';
  const categoryType = categoryTypeProp ?? CATEGORY_TYPE_MAP[categorySlugFromUrl] ?? '';
  const categoryDisplayName = CATEGORIES.find((c) => c.slug === categorySlugFromUrl)?.name ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>([]);
  const [expandedVariants, setExpandedVariants] = useState<ExpandedVariantProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsRequestIdRef = useRef(0);
  
  const searchQuery = searchParams.get('search') ?? '';

  // Initialize filters from URL query params
  const getInitialFilters = (): ProductsListParams => {
    const params: ProductsListParams = {
      limit: 10,
      page: 1,
    };

    if (searchParams.get('page')) {
      params.page = parseInt(searchParams.get('page')!);
    }
    if (searchParams.get('limit')) {
      params.limit = parseInt(searchParams.get('limit')!);
    }
    if (searchParams.get('sort')) {
      params.sort = searchParams.get('sort') as ProductsListParams['sort'];
    }
    if (searchParams.get('minPrice')) {
      params.minPrice = parseInt(searchParams.get('minPrice')!);
    }
    if (searchParams.get('maxPrice')) {
      params.maxPrice = parseInt(searchParams.get('maxPrice')!);
    }
    if (searchParams.get('color')) {
      params.color = searchParams.get('color')!;
    }
    if (searchParams.get('size')) {
      params.size = searchParams.get('size')!;
    }
    if (searchParams.get('availability')) {
      params.availability = searchParams.get('availability') as ProductsListParams['availability'];
    }

    return params;
  };

  const [filters, setFilters] = useState<ProductsListParams>(getInitialFilters);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }
    
    try {
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, []);

  // Initialize on mount and fetch wishlist
  useEffect(() => {
    setIsInitialized(true);
    fetchWishlist();
  }, [fetchWishlist]);

  // Fetch all products for filter options (unfiltered, large limit) — cached per category
  useEffect(() => {
    if (!isInitialized) return;
    const cacheKey = categoryType || "__all__";
    const cached = filterOptionsCache.get(cacheKey);
    if (cached) {
      setAllCategoryProducts(cached);
      return;
    }

    let cancelled = false;
    const fetchAllForFilters = async () => {
      try {
        const params: ProductsListParams = { limit: 500, page: 1 };
        if (categoryType) params.type = categoryType;
        const response: ProductsListResponse =
          await productService.getProductsList(params);
        if (cancelled) return;
        filterOptionsCache.set(cacheKey, response.products);
        setAllCategoryProducts(response.products);
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching all products for filters:", error);
        }
      }
    };
    fetchAllForFilters();
    return () => {
      cancelled = true;
    };
  }, [categoryType, isInitialized]);

  const fetchProducts = useCallback(async () => {
    const requestId = ++productsRequestIdRef.current;
    setLoading(true);
    try {
      const apiParams: ProductsListParams = { ...filters };
      if (categoryType) apiParams.type = categoryType;
      if (searchQuery) apiParams.search = searchQuery;
      const response: ProductsListResponse =
        await productService.getProductsList(apiParams);

      if (requestId !== productsRequestIdRef.current) return;
      
      // Expand products into variants (each variant becomes a separate card)
      const allExpandedVariants = response.products.flatMap((product) =>
        expandProductVariants(product)
      );
      
      setProducts(response.products);
      setExpandedVariants(allExpandedVariants);
      setTotalProducts(allExpandedVariants.length);
      setCurrentPage(response.page);
    } catch (error) {
      if (requestId === productsRequestIdRef.current) {
        console.error("Error fetching products:", error);
      }
    } finally {
      if (requestId === productsRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [filters, categoryType, searchQuery]);

  // Fetch products when filters, category or search query changes
  useEffect(() => {
    if (isInitialized) {
      fetchProducts();
    }
  }, [fetchProducts, isInitialized]);

  // Sync filters to URL query params
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (filters.page && filters.page !== 1) {
      params.set('page', filters.page.toString());
    }
    if (filters.limit && filters.limit !== 10) {
      params.set('limit', filters.limit.toString());
    }
    if (filters.sort) {
      params.set('sort', filters.sort);
    }
    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.color) {
      params.set('color', filters.color);
    }
    if (filters.size) {
      params.set('size', filters.size);
    }
    if (filters.availability) {
      params.set('availability', filters.availability);
    }

    if (categorySlugFromUrl) {
      params.set('category', categorySlugFromUrl);
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    const queryString = params.toString();
    const newUrl = queryString 
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, isInitialized, router, categorySlugFromUrl, searchQuery]);

  const isProductInWishlist = useCallback((productId: string, variantId: string, size: string): boolean => {
    return wishlistItems.some(
      (item) =>
        item.product != null &&
        item.product._id === productId &&
        item.variantId === variantId &&
        item.size === size
    );
  }, [wishlistItems]);

  const handleFilterChange = useCallback((newFilters: ProductsListParams) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const availableColors = useMemo(() => {
    const colorCounts = allCategoryProducts.reduce((acc, product) => {
      (product.allColors || []).forEach((color) => {
        const trimmed = color.trim();
        if (trimmed) {
          acc[trimmed] = (acc[trimmed] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(colorCounts).map(([color, count]) => ({
      color,
      count,
    }));
  }, [allCategoryProducts]);

  const availableSizes = useMemo(
    () =>
      Array.from(
        new Set(
          allCategoryProducts.flatMap((p) => (p.allSizes || []).map((s) => s.trim()).filter(Boolean))
        )
      ),
    [allCategoryProducts],
  );

  const productCards = useMemo(
    () =>
      expandedVariants.map((expandedVariant) => {
        const firstSize = expandedVariant.selectedVariant.sizes[0]?.size || "ONE_SIZE";
        return {
          key: `${expandedVariant._id}-${expandedVariant.selectedVariantId}`,
          product: adaptExpandedVariantToUI(expandedVariant),
          apiProduct: expandedVariant,
          isInWishlist: isProductInWishlist(
            expandedVariant._id,
            expandedVariant.selectedVariantId,
            firstSize,
          ),
        };
      }),
    [expandedVariants, isProductInWishlist],
  );

  // Derive page heading
  const pageHeading = searchQuery
    ? `Search results for "${searchQuery}"`
    : categoryDisplayName
    ? categoryDisplayName
    : 'All Products';

  return (
    <div className="flex-1 bg-background-light">
      {/* Mobile Filter Drawer Overlay */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <ProductFilters
            onFilterChange={(f) => { handleFilterChange(f); setMobileFiltersOpen(false); }}
            availableColors={availableColors}
            availableSizes={availableSizes}
            initialFilters={filters}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4 sm:py-6 lg:py-8">
        {/* Page heading + mobile filter button */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl text-text-primary">
              {pageHeading}
            </h1>
            {!loading && (
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>
          {/* Mobile/Tablet filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors flex-shrink-0 mt-1"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar — desktop only */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <ProductFilters
                onFilterChange={handleFilterChange}
                availableColors={availableColors}
                availableSizes={availableSizes}
                initialFilters={filters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg sm:text-xl text-text-secondary">
                  No products found matching your filters
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid - Variant-wise display */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {productCards.map((card) => (
                    <ProductCard
                      key={card.key}
                      product={card.product}
                      apiProduct={card.apiProduct}
                      initialWishlistState={card.isInWishlist}
                      onWishlistChange={fetchWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalProducts > (filters.limit || 10) && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalProducts / (filters.limit || 10))}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
