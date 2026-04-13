"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth-utils";
import { orderService } from "@/features/checkout/services/order.service";
import type { Order } from "@/features/checkout/types/order.types";
import {
  OrderStatus,
  PaymentStatus,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/features/checkout/types/order.types";
import { ROUTES } from "@/constants/routes";

const ORDER_STATUS_STEPS: OrderStatus[] = [
  OrderStatus.CREATED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

function getStatusStepIndex(status: OrderStatus): number {
  if (status === OrderStatus.CANCELLED) return -1;
  return ORDER_STATUS_STEPS.indexOf(status);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProductImage(order: Order): string {
  const firstItem = order.items[0];
  if (!firstItem) return "";
  const variant = firstItem.product.variants?.find(
    (v) => v.variantId === firstItem.variantId
  );
  return variant?.images?.[0] ?? firstItem.product.allImages?.[0] ?? "";
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PAID]: "bg-green-100 text-green-700",
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [PaymentStatus.FAILED]: "bg-red-100 text-red-700",
    [PaymentStatus.REFUNDED]: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`text-xs font-poppins font-medium px-2.5 py-0.5 rounded-full ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {PAYMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const stepIndex = getStatusStepIndex(status);
  const isCancelled = status === OrderStatus.CANCELLED;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
        <span className="text-xs font-poppins text-red-600 font-medium">
          Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 mt-3 overflow-x-auto">
      {ORDER_STATUS_STEPS.map((step, idx) => {
        const isCompleted = idx <= stepIndex;
        const isActive = idx === stepIndex;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompleted
                    ? isActive
                      ? "bg-primary ring-2 ring-primary/30"
                      : "bg-primary"
                    : "bg-gray-200"
                }`}
              >
                {isCompleted && !isActive && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-[10px] font-poppins mt-1 whitespace-nowrap ${isCompleted ? "text-primary font-medium" : "text-gray-400"}`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {idx < ORDER_STATUS_STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-0.5 flex-shrink-0 -mt-4 ${idx < stepIndex ? "bg-primary" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const productImage = getProductImage(order);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs font-poppins text-gray-400 mb-0.5">
              Order ID
            </p>
            <p className="text-sm font-poppins font-semibold text-gray-800 break-all">
              #{order._id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <PaymentBadge status={order.paymentStatus} />
            <p className="text-xs font-poppins text-gray-400">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4 items-start">
          {productImage && (
            <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={productImage}
                alt={order.items[0]?.product.name ?? "Product"}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-poppins font-medium text-gray-900 line-clamp-2 leading-snug">
              {order.items[0]?.product.name}
              {order.items.length > 1 && (
                <span className="text-gray-400 font-normal">
                  {" "}
                  +{order.items.length - 1} more
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
              <span className="text-xs font-poppins text-gray-500">
                Size:{" "}
                <span className="text-gray-700">
                  {order.items[0]?.size}
                </span>
              </span>
              <span className="text-xs font-poppins text-gray-500">
                Qty:{" "}
                <span className="text-gray-700">
                  {order.items[0]?.quantity}
                </span>
              </span>
              {order.items[0]?.product.variants?.find(
                (v) => v.variantId === order.items[0]?.variantId
              )?.color && (
                <span className="text-xs font-poppins text-gray-500">
                  Color:{" "}
                  <span className="text-gray-700">
                    {
                      order.items[0].product.variants.find(
                        (v) => v.variantId === order.items[0].variantId
                      )?.color
                    }
                  </span>
                </span>
              )}
            </div>
            <p className="text-sm font-poppins font-semibold text-gray-900 mt-1.5">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>

        <StatusTimeline status={order.orderStatus} />

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-4 text-xs font-poppins text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {isExpanded ? "Hide details" : "View details"}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-5 space-y-4">
          <div>
            <p className="text-xs font-poppins font-semibold text-gray-600 uppercase tracking-wide mb-2">
              All Items
            </p>
            <div className="space-y-2">
              {order.items.map((item) => {
                const variantImg = item.product.variants?.find(
                  (v) => v.variantId === item.variantId
                )?.images?.[0];
                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-gray-100"
                  >
                    {variantImg && (
                      <div className="relative w-10 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image
                          src={variantImg}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-poppins font-medium text-gray-800 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] font-poppins text-gray-500">
                        {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-poppins font-semibold text-gray-800 flex-shrink-0">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-poppins font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Shipping Address
            </p>
            <div className="bg-white rounded-lg p-3 border border-gray-100 text-xs font-poppins text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-800">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} –{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="mt-0.5 text-gray-500">
                📞 {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex justify-between items-center text-xs font-poppins text-gray-500 mb-1.5">
              <span>Subtotal ({order.items.length} items)</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-poppins text-gray-500 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center text-sm font-poppins font-semibold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {order.razorpayOrderId && (
            <div className="text-[11px] font-poppins text-gray-400">
              <p>
                Razorpay Order:{" "}
                <span className="text-gray-600">
                  {order.razorpayOrderId}
                </span>
              </p>
              {order.razorpayPaymentId && (
                <p>
                  Payment ID:{" "}
                  <span className="text-gray-600">
                    {order.razorpayPaymentId}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersSkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="w-16 h-20 bg-gray-100 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gray-200" />
                {s < 4 && <div className="w-8 h-0.5 bg-gray-100 mx-0.5 mt-0" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrackOrderPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    setIsChecking(false);

    if (!authenticated) {
      router.push(`${ROUTES.LOGIN}?referrer=${ROUTES.TRACK_ORDER}`);
      return;
    }

    setIsFetching(true);
    orderService
      .getMyOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch(() => {
        setFetchError("Failed to fetch orders. Please try again.");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-background-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm font-poppins text-gray-500 mt-1">
            Track and manage all your orders
          </p>
        </div>

        {isFetching && <OrdersSkeletonLoader />}

        {!isFetching && fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-sm font-poppins text-red-600">{fetchError}</p>
            <button
              onClick={() => {
                setFetchError(null);
                setIsFetching(true);
                orderService
                  .getMyOrders()
                  .then(setOrders)
                  .catch(() =>
                    setFetchError("Failed to fetch orders. Please try again.")
                  )
                  .finally(() => setIsFetching(false));
              }}
              className="mt-3 text-sm font-poppins font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isFetching && !fetchError && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-lg font-playfair font-semibold text-gray-800 mb-1">
              No orders yet
            </h2>
            <p className="text-sm font-poppins text-gray-500 mb-5">
              Looks like you haven&apos;t placed any orders. Start shopping!
            </p>
            <Link
              href={ROUTES.SHOP}
              className="inline-block bg-primary text-white text-sm font-poppins font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        )}

        {!isFetching && !fetchError && orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-poppins text-gray-400">
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </p>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
