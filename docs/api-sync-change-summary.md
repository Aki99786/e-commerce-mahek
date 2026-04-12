# API Sync Change Summary

**Date:** April 12, 2026  
**Scope:** Full frontend audit against `docs/API Doc.md` — 100% sync achieved  
**Result:** `npx tsc --noEmit` → **0 errors**

---

## 1. Products

### `src/features/products/types/index.ts`

| What Changed | Before | After |
|---|---|---|
| `ProductVariant._id` | Missing | Added `_id: string` |
| `ProductVariant.sizeDetails` | Present (fake field) | Removed (not in API) |
| `ProductsListParams.sort` | `"price-low" \| "price-high" \| "newest" \| "popular" \| "rating"` | `"latest" \| "price-low" \| "price-high" \| "rating"` |
| `ProductsListParams.availability` | `"IN_STOCK" \| "OUT_OF_STOCK" \| "PRE_ORDER"` | `"inStock" \| "outOfStock" \| "preOrder"` |
| Missing query params | — | Added: `category`, `subCategory`, `brand`, `fabric`, `pattern`, `isFeatured`, `search` |
| `TestimonialsResponse` | `Record<string, unknown>` | New typed interface `{ testimonials: unknown[] }` |
| `ProductSortOption` type | Inline in params | Extracted as named type alias |
| `ProductAvailability` type | Inline in params | Extracted as named type alias |
| `Product.isPreOrder` | Missing | Added `isPreOrder?: boolean` |

### `src/features/products/types/filters.ts`

| What Changed | Before | After |
|---|---|---|
| `SortOption` enum values | `RECOMMENDED`, `WHATS_NEW`, `POPULARITY`, `BETTER_DISCOUNT`, `PRICE_HIGH_TO_LOW`, `PRICE_LOW_TO_HIGH`, `CUSTOMER_RATING` | `LATEST`, `PRICE_LOW`, `PRICE_HIGH`, `RATING` |

### `src/features/products/constants/filters.ts`

| What Changed | Before | After |
|---|---|---|
| `SORT_OPTIONS` array | 7 options using old enum keys | 4 options using new API-aligned enum keys |

### `src/features/products/hooks/useProductFilters.ts`

| What Changed | Before | After |
|---|---|---|
| Default `sortBy` | `SortOption.RECOMMENDED` | `SortOption.LATEST` |
| Sort switch cases | Old enum keys (`PRICE_LOW_TO_HIGH`, `CUSTOMER_RATING`, `BETTER_DISCOUNT`, `WHATS_NEW`, `POPULARITY`) | New enum keys (`PRICE_LOW`, `PRICE_HIGH`, `RATING`, `LATEST`) |

### `src/features/products/components/ProductFilters.tsx`

| What Changed | Before | After |
|---|---|---|
| Availability radio values | `"IN_STOCK"`, `"OUT_OF_STOCK"`, `"PRE_ORDER"` | `"inStock"`, `"outOfStock"`, `"preOrder"` |

### `src/features/products/services/product.service.ts`

| What Changed | Before | After |
|---|---|---|
| `buildQueryString` params | 7 params (`type`, `limit`, `minPrice`, `maxPrice`, `sort`, `color`, `size`, `availability`, `page`) | All 12 API params including `category`, `subCategory`, `brand`, `fabric`, `pattern`, `isFeatured`, `search` |
| `getTestimonials` return type | `Record<string, unknown>` | `TestimonialsResponse` |

### `app/product/[id]/ProductDetailClient.tsx`

| What Changed | Before | After |
|---|---|---|
| `sizeDetails` display block | Rendered `selectedVariant.sizeDetails` | Removed (field doesn't exist in API) |

---

## 2. Authentication

### `src/features/auth/types/index.ts`

| What Changed | Before | After |
|---|---|---|
| `SendOtpResponse` shape | `{ success: boolean, message: string }` | `{ message: string, isLogin: boolean, userName: string }` |
| `VerifyOtpResponse` shape | `{ success, message, token?, user? }` | `{ user: UserData, token?: string }` |
| `UserData.role` type | `string` | `UserRole` (`"USER" \| "ADMIN" \| "MANAGER" \| "SUPPORT"`) |
| `UserRole` type | Missing | Added |
| `SendOtpRequest.name` | `name: string` (required) | `name?: string` (optional) |
| `LoginFormData` | `{ emailOrPhone, password }` | `{ email, password }` |
| `SignupFormData` | Present | Removed (not in API — OTP-only flow) |
| `Address` interface | Bogus stub with `zipCode`, `street` | Removed |
| `AdminLoginRequest` | Missing | Added `{ email, password }` |

### `src/features/auth/utils/validation.ts`

| What Changed | Before | After |
|---|---|---|
| Removed imports | `LoginFormData`, `SignupFormData`, `PASSWORD_MIN_LENGTH`, `FULL_NAME_MIN_LENGTH` | Cleaned up |
| `validateLoginForm` | Used `emailOrPhone` field (doesn't exist in API) | Removed |
| `validateSignupForm` | Used `SignupFormData` shape (not in API) | Removed |

### `src/features/auth/services/auth.service.ts`

| What Changed | Before | After |
|---|---|---|
| `handleUserData` | Had complex fallback parsing for flat object response | Simplified — only reads `result.user` (matches API) |

---

## 3. Wishlist

### `src/features/wishlist/types/index.ts`

| What Changed | Before | After |
|---|---|---|
| `RemoveFromWishlistRequest` | Missing | Added `{ productId, variantId, size }` |
| `BulkMoveToCartRequest` | `BulkMoveToCartItem[]` (bare array) | `{ items: BulkMoveToCartItem[] }` (wrapped object) |
| `BulkMoveToCartResponse` | Missing | Added `{ message: string, movedCount: number }` |

### `src/features/wishlist/services/wishlist.service.ts`

| What Changed | Before | After |
|---|---|---|
| `removeFromWishlist` param | `(productId: string)` | `(data: RemoveFromWishlistRequest)` |
| `bulkMoveToCart` return type | `Promise<void>` | `Promise<BulkMoveToCartResponse>` |

### `app/wishlist/page.tsx`

| What Changed | Before | After |
|---|---|---|
| `handleRemove` call | `removeFromWishlist(productId)` | `removeFromWishlist({ productId, variantId, size })` |

### `src/components/product/ProductCard.tsx`

| What Changed | Before | After |
|---|---|---|
| `removeFromWishlist` call | `removeFromWishlist(product.id)` | `removeFromWishlist({ productId, variantId, size })` |
| Variant/size extraction | Inside `else` branch only | Hoisted above `if/else` for reuse in both add and remove |

### `src/components/product/ProductImageGallery.tsx`

| What Changed | Before | After |
|---|---|---|
| `removeFromWishlist` call | `removeFromWishlist(productId)` | `removeFromWishlist({ productId, variantId, size })` |

---

## 4. Reviews

### `src/features/reviews/types/index.ts`

| What Changed | Before | After |
|---|---|---|
| `Review.id` | `id: string` | `_id: string` (MongoDB `_id`) |
| `Review.userId` | `userId: string` | `user: string` (matches API field name) |

---

## 5. Orders & Checkout

### `src/features/checkout/types/order.types.ts` *(NEW FILE)*

New file added with:
- `OrderStatus` enum — `CREATED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- `PaymentStatus` enum — `PENDING`, `PAID`, `FAILED`, `REFUNDED`
- `ORDER_STATUS_LABELS` — display text map for each status
- `PAYMENT_STATUS_LABELS` — display text map for each payment status
- `OrderItem` interface
- `OrderShippingAddress` interface
- `Order` interface — full order document shape from API
- `MyOrdersResponse` interface

### `src/features/checkout/services/order.service.ts`

| What Changed | Before | After |
|---|---|---|
| `getMyOrders` method | Missing | Added — returns `Order[]`, handles both array and `{ orders: [] }` response shapes |

### `src/lib/api-config.ts`

| What Changed | Before | After |
|---|---|---|
| `AUTH.LOGIN` | Missing | Added `"auth/login"` (admin password login endpoint) |

---

## 6. Pricing & Tax

### `src/lib/utils/currency.ts`

| What Changed | Before | After |
|---|---|---|
| `calculatePriceBreakdown` | Missing | Added — extracts `subtotal`, `gst` (5%), `shipping` (0), `total` from `sellingPrice` as per API doc §10 |
| `PriceBreakdown` interface | Missing | Added |

### `src/features/checkout/components/OrderSummaryPanel.tsx`

| What Changed | Before | After |
|---|---|---|
| Price breakdown display | Showed only "Total MRP" + "Shipping FREE" | Now shows **Subtotal + GST (5%) + Shipping FREE + Total** using `calculatePriceBreakdown` |
| "Inclusive of all taxes" note | Missing | Added below total |

---

## Summary of Files Changed

| File | Type |
|---|---|
| `src/features/products/types/index.ts` | Modified |
| `src/features/products/types/filters.ts` | Modified |
| `src/features/products/constants/filters.ts` | Modified |
| `src/features/products/hooks/useProductFilters.ts` | Modified |
| `src/features/products/components/ProductFilters.tsx` | Modified |
| `src/features/products/services/product.service.ts` | Modified |
| `app/product/[id]/ProductDetailClient.tsx` | Modified |
| `src/features/auth/types/index.ts` | Modified |
| `src/features/auth/utils/validation.ts` | Modified |
| `src/features/auth/services/auth.service.ts` | Modified |
| `src/features/wishlist/types/index.ts` | Modified |
| `src/features/wishlist/services/wishlist.service.ts` | Modified |
| `app/wishlist/page.tsx` | Modified |
| `src/components/product/ProductCard.tsx` | Modified |
| `src/components/product/ProductImageGallery.tsx` | Modified |
| `src/features/reviews/types/index.ts` | Modified |
| `src/features/checkout/types/order.types.ts` | **New File** |
| `src/features/checkout/services/order.service.ts` | Modified |
| `src/lib/api-config.ts` | Modified |
| `src/lib/utils/currency.ts` | Modified |
| `src/features/checkout/components/OrderSummaryPanel.tsx` | Modified |

**Total: 20 files modified, 1 file created**
