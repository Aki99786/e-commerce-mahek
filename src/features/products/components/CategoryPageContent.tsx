"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import { productService } from "../services/product.service";
import { wishlistService } from "@/features/wishlist/services/wishlist.service";
import { expandProductVariants } from "../utils/variant-expander";
import { adaptExpandedVariantToUI } from "../utils/variant-product-adapter";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { isAuthenticated } from "@/lib/auth-utils";
import type {
  Product,
  ProductsListParams,
  ProductsListResponse,
  FilterOptionsData,
} from "../types";
import { CATEGORY_TYPE_MAP } from "../types";
import { Pagination } from "./Pagination";
import { CATEGORIES } from "@/constants/categories";
import type { ExpandedVariantProduct } from "../utils/variant-expander";
import type { WishlistItem } from "@/features/wishlist/types";

interface CategoryPageContentProps {
  categoryType?: string;
}

export function CategoryPageContent({
  categoryType: categoryTypeProp,
}: CategoryPageContentProps = {}) {
  const searchParams = useSearchParams();

  // Resolve categoryType: prop overrides URL (backward compat), else read ?category=
  const categorySlugFromUrl = searchParams.get('category') ?? '';
  const categoryType = categoryTypeProp ?? CATEGORY_TYPE_MAP[categorySlugFromUrl] ?? '';
  const categoryDisplayName = CATEGORIES.find((c) => c.slug === categorySlugFromUrl)?.name ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData | null>(null);
  const [expandedVariants, setExpandedVariants] = useState<ExpandedVariantProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsRequestIdRef = useRef(0);
  
  const searchQuery = searchParams.get('search') ?? '';

  // Initialize filters from URL query params
  const getInitialFilters = (): ProductsListParams => {
    const params: ProductsListParams = {
      limit: 12,
      page: 1,
    };

    if (searchParams.get('page')) {
      const parsedPage = parseInt(searchParams.get('page')!, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        params.page = parsedPage;
      }
    }
    if (searchParams.get('limit')) {
      const parsedLimit = parseInt(searchParams.get('limit')!, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        params.limit = parsedLimit;
      }
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
    if (searchParams.get('brand')) {
      params.brand = searchParams.get('brand')!;
    }
    if (searchParams.get('fabric')) {
      params.fabric = searchParams.get('fabric')!;
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
      setWishlistItems(response?.list ?? []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, []);

  // Initialize on mount and fetch wishlist
  useEffect(() => {
    setIsInitialized(true);
    fetchWishlist();
  }, [fetchWishlist]);

  // Fetch filter options from API
  useEffect(() => {
    let isMounted = true;
    const fetchFilters = async () => {
      try {
        const response = await productService.getFilterOptions();
        if (isMounted && response?.data) {
          setFilterOptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilters();
    return () => {
      isMounted = false;
    };
  }, []);

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
      const allExpandedVariants = (response.products || []).flatMap((product) =>
        expandProductVariants(product)
      );
      
      setProducts(response.products || []);
      setExpandedVariants(allExpandedVariants);

      const total = typeof response.total === 'number' ? response.total : allExpandedVariants.length;
      setTotalProducts(total);

      const limit = filters.limit || response.limit || 12;
      const computedTotalPages = response.totalPages || Math.ceil(total / limit) || 1;
      setTotalPages(computedTotalPages);

      const pageNum = filters.page ?? (response.offset !== undefined ? response.offset + 1 : 1);
      setCurrentPage(pageNum);
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
    if (filters.limit && filters.limit !== 12) {
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
    if (filters.brand) {
      params.set('brand', filters.brand);
    }
    if (filters.fabric) {
      params.set('fabric', filters.fabric);
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
      window.history.pushState(null, '', newUrl);
    }
  }, [filters, isInitialized, categorySlugFromUrl, searchQuery]);

  // Sync state on browser Back / Forward buttons without fighting React state
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(params.get('page') || '1', 10) || 1;
      setFilters((prev) => {
        if ((prev.page || 1) === pageFromUrl) return prev;
        return { ...prev, page: pageFromUrl };
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isProductInWishlist = useCallback((productId: string, variantId: string, size?: string): boolean => {
    void size;
    return wishlistItems.some(
      (item: any) =>
        (item?.product_id === productId || item?.product?._id === productId) &&
        (!variantId || item?.variant?.variant_id === variantId || item?.variant?._id === variantId)
    );
  }, [wishlistItems]);

  const handleFilterChange = useCallback((newFilters: ProductsListParams) => {
    setFilters({ ...newFilters, page: newFilters.page ?? 1 });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            filterOptions={filterOptions}
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
            <div className="bg-white p-5 rounded-lg shadow-sm sticky top-4 border border-gray-100">
              <ProductFilters
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                initialFilters={filters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={12} />
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
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
