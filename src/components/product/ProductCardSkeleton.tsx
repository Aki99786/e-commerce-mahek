"use client";

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton() {
  return (
    <div className="relative w-full bg-white flex flex-col rounded-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Thumbnail Aspect 3/4 */}
      <div className="relative aspect-[3/4] w-full bg-gray-200 overflow-hidden">
        {/* Top-left badge placeholder */}
        <div className="absolute top-2.5 left-2.5 w-12 h-5 bg-gray-300/80 rounded" />
        {/* Top-right wishlist circle placeholder */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-gray-300/80 rounded-full" />
      </div>

      {/* Details Below Image */}
      <div className="pt-2.5 pb-3 px-2 sm:px-2.5 text-left space-y-1.5">
        {/* Brand placeholder */}
        <div className="h-3 bg-gray-200 rounded w-24" />
        {/* Title placeholder */}
        <div className="h-3.5 bg-gray-200 rounded w-4/5" />
        {/* Price row placeholder */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: ProductCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductFiltersSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-200">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-3.5 w-16 bg-gray-100 rounded" />
      </div>

      {/* Categories skeleton */}
      <div className="py-2 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-28 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Brand skeleton */}
      <div className="py-2 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-16 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-32 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      {/* Price skeleton */}
      <div className="py-2 border-b border-gray-200 space-y-3">
        <div className="h-3.5 w-14 bg-gray-200 rounded" />
        <div className="h-2 bg-gray-200 rounded-full w-full my-2" />
        <div className="h-3.5 w-24 bg-gray-100 rounded" />
      </div>

      {/* Color skeleton */}
      <div className="py-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-14 bg-gray-200 rounded" />
          <div className="w-5 h-5 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-16 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded bg-gray-200 flex-shrink-0" />
            <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
