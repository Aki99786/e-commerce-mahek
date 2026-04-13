"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { CATEGORIES } from "@/constants/categories";
import type { ExpandedVariantProduct } from "../utils/variant-expander";
import type { WishlistItem } from "@/features/wishlist/types";

interface CategoryPageContentProps {
  categoryType?: string;
}

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

  // Initialize filters from URL on mount and fetch wishlist
  useEffect(() => {
    setFilters(getInitialFilters());
    setIsInitialized(true);
    fetchWishlist();
  }, []);

  // Fetch all products for filter options (unfiltered, large limit)
  useEffect(() => {
    if (!isInitialized) return;
    const fetchAllForFilters = async () => {
      try {
        const params: ProductsListParams = { limit: 500, page: 1 };
        if (categoryType) params.type = categoryType;
        const response: ProductsListResponse =
          await productService.getProductsList(params);
        setAllCategoryProducts(response.products);
      } catch (error) {
        console.error("Error fetching all products for filters:", error);
      }
    };
    fetchAllForFilters();
  }, [categoryType, isInitialized]);

  // Re-fetch when search query changes
  useEffect(() => {
    if (!isInitialized) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [searchQuery, isInitialized]);

  // Fetch products when filters or category changes
  useEffect(() => {
    if (isInitialized) {
      fetchProducts();
    }
  }, [filters, categoryType, isInitialized, searchQuery]);

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
    
    router.replace(newUrl, { scroll: false });
  }, [filters, isInitialized, router, categorySlugFromUrl, searchQuery]);

  const fetchWishlist = async () => {
    if (!isAuthenticated()) {
      return;
    }
    
    try {
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchProducts = async (isUnfilteredFetch = false) => {
    setLoading(true);
    try {
      const apiParams: ProductsListParams = { ...filters };
      if (categoryType) apiParams.type = categoryType;
      if (searchQuery) apiParams.search = searchQuery;
      const response: ProductsListResponse =
        await productService.getProductsList(apiParams);
      
      // Expand products into variants (each variant becomes a separate card)
      const allExpandedVariants = response.products.flatMap((product) =>
        expandProductVariants(product)
      );
      
      setProducts(response.products);
      setExpandedVariants(allExpandedVariants);
      setTotalProducts(allExpandedVariants.length);
      setCurrentPage(response.page);

      // On first unfiltered fetch, store the full category products for filter options
      if (isUnfilteredFetch) {
        setAllCategoryProducts(response.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const isProductInWishlist = (productId: string, variantId: string, size: string): boolean => {
    return wishlistItems.some(
      (item) =>
        item.product._id === productId &&
        item.variantId === variantId &&
        item.size === size
    );
  };

  const handleFilterChange = (newFilters: ProductsListParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // Aggregate colors from full unfiltered category products (stable filter options)
  const colorCounts = allCategoryProducts.reduce((acc, product) => {
    (product.allColors || []).forEach((color) => {
      const trimmed = color.trim();
      if (trimmed) {
        acc[trimmed] = (acc[trimmed] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const availableColors = Object.entries(colorCounts).map(([color, count]) => ({
    color,
    count,
  }));

  // Aggregate sizes from full unfiltered category products (stable filter options)
  const availableSizes = Array.from(
    new Set(
      allCategoryProducts.flatMap((p) => (p.allSizes || []).map((s) => s.trim()).filter(Boolean))
    )
  );

  // Derive page heading
  const pageHeading = searchQuery
    ? `Search results for "${searchQuery}"`
    : categoryDisplayName
    ? categoryDisplayName
    : 'All Products';

  return (
    <div className="min-h-screen bg-background-light">
      {/* Main Content */}
      <div className="container-fluid py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-playfair text-text-primary">
            {pageHeading}
          </h1>
          {!loading && (
            <p className="text-sm font-poppins text-text-secondary mt-1">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
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
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-poppins text-text-secondary">
                  No products found matching your filters
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid - Variant-wise display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {expandedVariants.map((expandedVariant) => {
                    const firstSize = expandedVariant.selectedVariant.sizes[0]?.size || "ONE_SIZE";
                    const isInWishlist = isProductInWishlist(
                      expandedVariant._id,
                      expandedVariant.selectedVariantId,
                      firstSize
                    );
                    
                    return (
                      <ProductCard
                        key={`${expandedVariant._id}-${expandedVariant.selectedVariantId}`}
                        product={adaptExpandedVariantToUI(expandedVariant)}
                        apiProduct={expandedVariant}
                        initialWishlistState={isInWishlist}
                        onWishlistChange={fetchWishlist}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalProducts > (filters.limit || 10) && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-border-light rounded-md font-poppins disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-light"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 font-poppins">
                      Page {currentPage} of{" "}
                      {Math.ceil(totalProducts / (filters.limit || 10))}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage >=
                        Math.ceil(totalProducts / (filters.limit || 10))
                      }
                      className="px-4 py-2 border border-border-light rounded-md font-poppins disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-light"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
