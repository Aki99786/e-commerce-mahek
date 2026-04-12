# Mahek Sarees — Frontend Integration Documentation

**Base URL (Staging):** `https://api.staging.maheksarees.in`  
**Base URL (Production):** `https://api.maheksarees.in`  
**All requests:** `Content-Type: application/json`  
**Auth:** `Authorization: Bearer <token>` header on protected routes.  
Token comes back in the **response `Authorization` header** (not the body) on login/verify-otp.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products — Customer Side](#2-products--customer-side)
3. [Cart](#3-cart)
4. [Wishlist](#4-wishlist)
5. [Address Management](#5-address-management)
6. [Checkout & Payment (Razorpay) — DETAILED FLOW](#6-checkout--payment-razorpay)
7. [Order History & Tracking](#7-order-history--tracking)
8. [Reviews](#8-reviews)
9. [Admin Panel — Full API Reference](#9-admin-panel)
10. [Tax Calculation Notes](#10-tax-calculation)
11. [Error Handling](#11-error-handling)
12. [Important Notes & Gotchas](#12-important-notes--gotchas)

---

## 1. Authentication

### 1.1 Customer Login (OTP Flow)

#### Step 1 — Send OTP

```
POST /api/auth/send-otp
```

**Body:**

```json
{ "email": "customer@example.com", "name": "Priya" }
```

**Response:**

```json
{
  "message": "OTP sent to email",
  "isLogin": false,
  "userName": "Priya"
}
```

- `isLogin: false` → new user (show signup UI)
- `isLogin: true` → existing user (show login UI)

---

#### Step 2 — Verify OTP & Get Token

```
POST /api/auth/verify-otp
```

**Body:**

```json
{ "email": "customer@example.com", "otp": "123456" }
```

**Response body:**

```json
{
  "user": {
    "id": "6611abc...",
    "email": "customer@example.com",
    "name": "Priya",
    "role": "USER",
    "addresses": []
  }
}
```

> ⚠️ **IMPORTANT:** JWT token is in the **response header**, NOT in the body.
>
> ```
> Authorization: Bearer eyJhbGciOiJIUzI1Ni...
> ```
>
> Store this token in `localStorage` or memory. Send it as `Authorization: Bearer <token>` on all protected API calls.

---

### 1.2 Admin Login (Password)

```
POST /api/auth/login
```

**Body:**

```json
{ "email": "admin@maheksarees.com", "password": "Admin@123" }
```

**Response:** Same pattern — token is in `Authorization` response header.

---

## 2. Products — Customer Side

All product endpoints are **public** (no auth required).

### 2.1 Homepage Sections

| Endpoint                         | Purpose                          | Returns                   |
| -------------------------------- | -------------------------------- | ------------------------- |
| `GET /api/products/best-selling` | Best selling (sorted by reviews) | `{ products: [...] }`     |
| `GET /api/products/trending`     | Trending (newest)                | `{ products: [...] }`     |
| `GET /api/products/flash-sale`   | Flash sale (lowest price)        | `{ products: [...] }`     |
| `GET /api/products/lehengas`     | Lehengas category                | `{ products: [...] }`     |
| `GET /api/products/testimonials` | Site testimonials from reviews   | `{ testimonials: [...] }` |

---

### 2.2 Product Listing (Shop Page)

```
GET /api/products/list
```

**Query Params:**

| Param          | Type    | Example    | Notes                                            |
| -------------- | ------- | ---------- | ------------------------------------------------ |
| `category`     | string  | `saree`    | Also accepts `type`                              |
| `subCategory`  | string  | `silk`     |                                                  |
| `brand`        | string  | `mahek`    |                                                  |
| `color`        | string  | `red,blue` | Comma-separated                                  |
| `size`         | string  | `S,M,L`    | Comma-separated                                  |
| `fabric`       | string  | `silk`     |                                                  |
| `pattern`      | string  | `floral`   |                                                  |
| `minPrice`     | number  | `500`      | Based on `avgPrice`                              |
| `maxPrice`     | number  | `5000`     |                                                  |
| `availability` | string  | `inStock`  | `inStock` / `outOfStock` / `preOrder`            |
| `isFeatured`   | boolean | `true`     |                                                  |
| `search`       | string  | `banarasi` | Full text search                                 |
| `sort`         | string  | `latest`   | `latest` / `price-low` / `price-high` / `rating` |
| `page`         | number  | `1`        | Default: 1                                       |
| `limit`        | number  | `12`       | Max: 50                                          |

**Response:**

```json
{
  "total": 120,
  "page": 1,
  "limit": 12,
  "totalPages": 10,
  "products": [...]
}
```

---

### 2.3 Single Product

```
GET /api/products/:id
```

**Response:** Full product document including `variants[]`, `reviews[]`, `allImages[]`.

**Product variant structure:**

```json
{
  "_id": "...",
  "variantId": "...",
  "color": "Red",
  "sellingPrice": 1499,
  "mrp": 2000,
  "images": ["url1", "url2"],
  "sizes": [
    { "size": "ONE_SIZE", "stock": 10 },
    { "size": "S", "stock": 5 }
  ]
}
```

> 💡 **Sarees always have size `ONE_SIZE`.** Never show a size picker for sarees — just pass `ONE_SIZE` as the size everywhere.

---

## 3. Cart

All cart endpoints require `Authorization` header.

### 3.1 Add to Cart

```
POST /api/cart/add
```

**Body:**

```json
{
  "productId": "6611abc...",
  "variantId": "6611def...",
  "size": "ONE_SIZE",
  "quantity": 1
}
```

**Success:** `{ "message": "Added to cart" }`

**Errors:**

- `400` — Variant not found / Invalid size / Out of stock / Insufficient stock

---

### 3.2 Get Cart

```
GET /api/cart/list
```

**Response:**

```json
{
  "items": [
    {
      "product": {
        "_id": "...",
        "name": "Red Banarasi Saree",
        "slug": "...",
        "allImages": ["url1"]
      },
      "variantId": "...",
      "color": "Red",
      "size": "ONE_SIZE",
      "quantity": 2,
      "price": 1499
    }
  ]
}
```

---

### 3.3 Update Cart Item Quantity

```
PUT /api/cart/update
```

**Body:**

```json
{
  "productId": "...",
  "variantId": "...",
  "size": "ONE_SIZE",
  "quantity": 3
}
```

---

### 3.4 Remove Cart Item

```
DELETE /api/cart/remove
```

**Body:**

```json
{ "productId": "...", "variantId": "...", "size": "ONE_SIZE" }
```

---

### 3.5 Clear Cart

```
DELETE /api/cart/clear
```

---

## 4. Wishlist

All wishlist endpoints require `Authorization` header.

### 4.1 Get Wishlist

```
GET /api/wishlist/list
```

**Response:** `{ "items": [{ "product": {...}, "variantId": "...", "size": "..." }] }`

---

### 4.2 Add to Wishlist

```
POST /api/wishlist/add
```

**Body:** `{ "productId": "...", "variantId": "...", "size": "ONE_SIZE" }`

---

### 4.3 Remove from Wishlist

```
DELETE /api/wishlist/remove
```

**Body:** `{ "productId": "...", "variantId": "...", "size": "ONE_SIZE" }`

---

### 4.4 Move Single Item to Cart

```
POST /api/wishlist/move-to-cart
```

**Body:** `{ "productId": "...", "variantId": "...", "size": "ONE_SIZE" }`

---

### 4.5 Bulk Move Wishlist → Cart

```
POST /api/wishlist/bulk-move-to-cart
```

**Body:**

```json
{
  "items": [
    { "productId": "...", "variantId": "...", "size": "ONE_SIZE" },
    { "productId": "...", "variantId": "...", "size": "M" }
  ]
}
```

**Response:** `{ "message": "...", "movedCount": 2 }`

---

## 5. Address Management

All address endpoints require `Authorization` header.

### 5.1 Get Saved Addresses

```
GET /api/auth/addresses
```

**Response:**

```json
{
  "addresses": [
    {
      "_id": "6611aaa...",
      "fullName": "Priya Sharma",
      "phone": "9876543210",
      "addressLine1": "123 Main St",
      "addressLine2": "Near Park",
      "city": "Surat",
      "state": "Gujarat",
      "pincode": "395001",
      "isDefault": true
    }
  ]
}
```

---

### 5.2 Add Address

```
POST /api/auth/addresses
```

**Body:**

```json
{
  "fullName": "Priya Sharma",
  "phone": "9876543210",
  "addressLine1": "123 Main St",
  "addressLine2": "Near Park",
  "city": "Surat",
  "state": "Gujarat",
  "pincode": "395001",
  "isDefault": true
}
```

**Required fields:** `fullName`, `phone`, `addressLine1`, `city`, `state`, `pincode`

> If `isDefault: true` — all other addresses will have their `isDefault` unset automatically.

---

### 5.3 Update Address

```
PUT /api/auth/addresses/:addressId
```

**Body:** Any subset of address fields.

---

### 5.4 Delete Address

```
DELETE /api/auth/addresses/:addressId
```

---

## 6. Checkout & Payment (Razorpay)

> This is the most important flow. Read carefully.

### 6.1 Complete Flow Diagram

```
User on Cart Page
       │
       ▼
[Select / Enter Address]
       │  POST /api/auth/addresses  (if new)
       │  GET /api/auth/addresses   (show saved)
       │
       ▼
POST /api/orders/checkout  ──── validates cart + address
       │                        creates Razorpay order
       │                        returns: razorpayOrderId, amount, key_id
       ▼
Open Razorpay Payment Modal (frontend JS)
       │
       ├── Payment SUCCESS ──► razorpayOrderId + razorpayPaymentId + razorpaySignature
       │                       POST /api/orders/verify-payment
       │                         ├─ verifies HMAC signature
       │                         ├─ deducts stock
       │                         ├─ creates DB order
       │                         ├─ creates Shiprocket shipment (auto)
       │                         └─ clears cart
       │
       └── Payment FAILED ──► show error, let user retry
```

---

### 6.2 Step 1 — Create Razorpay Order

```
POST /api/orders/checkout
Authorization: Bearer <token>
```

**Body (Option A — use saved address ID):**

```json
{ "addressId": "6611aaa..." }
```

**Body (Option B — enter address inline):**

```json
{
  "address": {
    "fullName": "Priya Sharma",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Near Park",
    "city": "Surat",
    "state": "Gujarat",
    "pincode": "395001"
  }
}
```

**Success Response `200`:**

```json
{
  "razorpayOrderId": "order_Nxxxxxxxxxxxxxx",
  "amount": 149900,
  "currency": "INR",
  "key_id": "rzp_test_xxxxxxxx",
  "prefill": {
    "name": "Priya Sharma",
    "email": "customer@example.com",
    "contact": "9876543210"
  },
  "shippingAddress": { ... }
}
```

> ⚠️ `amount` is in **paise** (₹1499 = 149900 paise). Razorpay expects paise.

**Error Responses:**

- `400` — Cart is empty
- `400` — Address not found
- `400` — Insufficient stock for a product
- `500` — Razorpay API failure

---

### 6.3 Step 2 — Open Razorpay Modal (Frontend JS)

```javascript
// Load Razorpay checkout script first
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const response = await fetch("/api/orders/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ addressId: selectedAddressId }),
});

const data = await response.json();

const options = {
  key: data.key_id,
  amount: data.amount, // in paise
  currency: data.currency,
  order_id: data.razorpayOrderId,
  name: "Mahek Sarees",
  description: "Order Payment",
  image: "https://maheksarees.in/logo.png",
  prefill: data.prefill,
  theme: { color: "#B5452A" },

  handler: async function (paymentResponse) {
    // Payment SUCCESS — verify on backend
    const verifyRes = await fetch("/api/orders/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        addressId: selectedAddressId, // same address used in step 1
      }),
    });

    const order = await verifyRes.json();

    if (verifyRes.ok) {
      // ✅ SUCCESS — redirect to order confirmation
      window.location.href = `/order-confirmation?orderId=${order.order._id}`;
    } else {
      alert("Payment verification failed: " + order.message);
    }
  },

  modal: {
    ondismiss: function () {
      // User closed the modal without paying
      console.log("Payment cancelled");
    },
  },
};

const rzp = new Razorpay(options);
rzp.open();
```

---

### 6.4 Step 3 — Verify Payment

```
POST /api/orders/verify-payment
Authorization: Bearer <token>
```

**Body:**

```json
{
  "razorpayOrderId": "order_Nxxxxxxxxxxxxxx",
  "razorpayPaymentId": "pay_Oxxxxxxxxxxxxxx",
  "razorpaySignature": "abc123def456...",
  "addressId": "6611aaa..."
}
```

> You can pass `address: {...}` inline here too instead of `addressId`.

**Success Response `201`:**

```json
{
  "message": "Payment verified and order placed",
  "order": {
    "_id": "6621ccc...",
    "user": "6611abc...",
    "items": [...],
    "shippingAddress": {
      "fullName": "Priya Sharma",
      "phone": "9876543210",
      "addressLine1": "123 Main Street",
      "city": "Surat",
      "state": "Gujarat",
      "pincode": "395001"
    },
    "totalAmount": 1499,
    "paymentStatus": "PAID",
    "orderStatus": "PROCESSING",
    "razorpayOrderId": "order_Nxx...",
    "razorpayPaymentId": "pay_Oxx...",
    "shiprocketOrderId": "123456789",
    "shiprocketShipmentId": "987654321",
    "awbCode": "AWB123456789",
    "courierName": "Delhivery",
    "createdAt": "2026-04-10T..."
  }
}
```

**Error Responses:**

- `400` — `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` missing
- `400` — `Invalid payment signature` (tampered payment)
- `400` — Cart is empty (re-validated after payment)
- `400` — Insufficient stock

---

### 6.5 What Happens Automatically After Payment

1. ✅ HMAC-SHA256 signature verified (prevents fake payments)
2. ✅ Stock deducted for all ordered items
3. ✅ Order document created in DB with `paymentStatus: PAID`
4. ✅ Shiprocket shipment created automatically
5. ✅ AWB tracking number stored on the order (if Shiprocket assign succeeds)
6. ✅ Cart cleared
7. ✅ Order returned in response

---

## 7. Order History & Tracking

### 7.1 Get My Orders

```
GET /api/orders/my
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "6621ccc...",
    "items": [
      {
        "product": {
          "_id": "...",
          "name": "Red Banarasi Saree",
          "allImages": ["url"]
        },
        "variantId": "...",
        "size": "ONE_SIZE",
        "quantity": 1,
        "price": 1499
      }
    ],
    "shippingAddress": { ... },
    "totalAmount": 1499,
    "paymentStatus": "PAID",
    "orderStatus": "PROCESSING",
    "awbCode": "AWB123456789",
    "courierName": "Delhivery",
    "shiprocketShipmentId": "987654321",
    "createdAt": "2026-04-10T..."
  }
]
```

---

### 7.2 Track Order (Shiprocket AWB)

> **No direct backend tracking endpoint yet.** Frontend can track using:

**Option A — Shiprocket Track API (call from backend or frontend):**

```
GET https://apiv2.shiprocket.in/v1/external/courier/track/awb/{awbCode}
Authorization: Bearer <shiprocket_token>
```

**Option B — Delhivery/DTDC tracking widget:**  
Pass the `awbCode` from the order to the courier's tracking URL:

```
https://www.delhivery.com/track/package/{awbCode}
```

**Option C — Add a tracking endpoint (recommended for production):**  
Ask backend to expose `GET /api/orders/:id/track` which internally calls Shiprocket and returns status.

**Order Status Values (what to display):**

| `orderStatus` | Display Text   |
| ------------- | -------------- |
| `CREATED`     | Order Placed   |
| `PROCESSING`  | Being Prepared |
| `SHIPPED`     | Shipped        |
| `DELIVERED`   | Delivered      |
| `CANCELLED`   | Cancelled      |

| `paymentStatus` | Display           |
| --------------- | ----------------- |
| `PENDING`       | Payment Pending   |
| `PAID`          | Paid ✅           |
| `FAILED`        | Payment Failed ❌ |
| `REFUNDED`      | Refunded          |

---

## 8. Reviews

All review endpoints require `Authorization` header.

### 8.1 Add Review

```
POST /api/products/:productId/reviews
```

**Body:**

```json
{
  "rating": 5,
  "title": "Beautiful saree!",
  "comment": "The quality is amazing and delivery was fast."
}
```

- `rating`: 1–5 (required)
- `title`: required
- `comment`: required
- One review per user per product. Trying to add again returns `400`.

---

### 8.2 Update Own Review

```
PUT /api/products/:productId/reviews/:reviewId
```

**Body:** Any subset of `{ rating, title, comment }`

---

### 8.3 Delete Own Review

```
DELETE /api/products/:productId/reviews/:reviewId
```

> Admin can delete any review. Users can only delete their own.

---

## 9. Admin Panel

All admin endpoints require `Authorization: Bearer <admin_token>`.

### 9.1 Auth

- Admin login: `POST /api/auth/login` with `{ email, password }`
- Token comes back in response `Authorization` header — same as user login.

---

### 9.2 Dashboard

```
GET /api/admin/dashboard
```

**Response:**

```json
{
  "totalUsers": 250,
  "totalOrders": 89,
  "totalRevenue": 134250,
  "totalProducts": 45,
  "ordersByStatus": [
    { "_id": "PROCESSING", "count": 12 },
    { "_id": "DELIVERED", "count": 65 }
  ],
  "lowStockProducts": [
    { "name": "Pink Saree", "totalStock": 2 }
  ],
  "usersByRole": [...],
  "verifiedUsers": 200,
  "activeUsers": 245
}
```

---

### 9.3 Order Management

#### Get All Orders (with filters)

```
GET /api/admin/orders?status=PROCESSING&page=1&limit=20&search=priya
```

**Query Params:**

- `status`: `CREATED` / `PROCESSING` / `SHIPPED` / `DELIVERED` / `CANCELLED`
- `search`: searches by user name, email, or order ID
- `page`, `limit`: pagination

**Response:** `{ orders: [...], pagination: { total, page, limit, totalPages } }`

---

#### Get Single Order

```
GET /api/admin/orders/:orderId
```

---

#### Update Order Status

```
PATCH /api/orders/:orderId/status
Authorization: Bearer <admin_or_support_token>
```

**Body:**

```json
{ "status": "SHIPPED" }
```

**Valid values:** `CREATED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

**Response:** Updated order document.

---

### 9.4 Product Management

#### Create Product

```
POST /api/products/add-product
```

**Body:**

```json
{
  "productName": "Red Banarasi Saree",
  "category": "saree",
  "subCategory": "banarasi",
  "brand": "Mahek",
  "description": "...",
  "isPreOrder": false,
  "variants": [
    {
      "color": "Red",
      "sellingPrice": 1499,
      "mrp": 2000,
      "images": ["url1", "url2"],
      "sizes": [{ "size": "ONE_SIZE", "stock": 10 }]
    }
  ]
}
```

> For sarees: always use `ONE_SIZE`. If you provide no sizes for a saree, the backend automatically creates `ONE_SIZE` with 10 stock.

---

#### Update Product

```
PUT /api/products/update-product/:id
```

Partial update — only send fields you want to change.

---

#### Delete Product (Soft Delete)

```
DELETE /api/products/delete/:id
```

Sets `isActive: false`. Product stops appearing in listings.

---

### 9.5 User Management

#### Get All Users

```
GET /api/admin/users?role=USER&search=priya&page=1&limit=20
```

**Query Params:** `role`, `emailVerified` (true/false), `isActive` (true/false), `search`, `page`, `limit`

---

#### Get User by ID

```
GET /api/admin/users/:userId
```

---

#### Update User

```
PUT /api/admin/users/:userId
```

**Body:** `{ name, email, role, phone, isActive }`

---

#### Deactivate / Delete User

```
DELETE /api/admin/users/:userId?permanent=false
```

- `permanent=false` (default): sets `isActive: false`
- `permanent=true`: permanently deletes from DB

---

#### Create Staff User (Admin / Manager / Support)

```
POST /api/admin/users
```

**Body:**

```json
{
  "name": "Rahul",
  "email": "rahul@maheksarees.com",
  "password": "StrongPass@123",
  "role": "SUPPORT",
  "phone": "9876543210",
  "sendVerification": true
}
```

---

### 9.6 Role Management

#### Get All Roles

```
GET /api/admin/roles
```

#### Create Role

```
POST /api/admin/roles
```

**Body:** `{ name: "MANAGER", displayName: "Manager", permissions: ["users.read", "orders.read"], description: "..." }`

#### Update Role

```
PUT /api/admin/roles/:roleId
```

#### Delete Role (only custom roles, not USER/ADMIN)

```
DELETE /api/admin/roles/:roleId
```

---

## 10. Tax Calculation

> The backend does **not currently apply GST automatically**. All prices in the DB are inclusive or exclusive depending on how admin enters them.

### Recommended Frontend Approach

For sarees, the GST rate is **5%**.

```javascript
// Calculate display price breakdown
function calculatePriceBreakdown(sellingPrice) {
  const GST_RATE = 0.05; // 5% for sarees/garments
  const basePrice = sellingPrice / (1 + GST_RATE); // extract base from inclusive price
  const gst = sellingPrice - basePrice;
  const shipping = 0; // Free shipping (handled by Shiprocket)

  return {
    subtotal: Math.round(basePrice),
    gst: Math.round(gst),
    shipping,
    total: sellingPrice,
  };
}

// Display on checkout page:
// Subtotal:  ₹1,428
// GST (5%):  ₹71
// Shipping:  FREE
// Total:     ₹1,499
```

> 📌 **Note:** The `totalAmount` stored in the order is the full selling price.
> The Razorpay amount charged = `totalAmount * 100` (paise).
> No separate tax field is stored — tax is assumed to be included in `sellingPrice`.

---

## 11. Error Handling

All API errors follow this shape:

```json
{ "message": "Human-readable error message" }
```

**Common HTTP Status Codes:**

| Code          | Meaning                        | Action                          |
| ------------- | ------------------------------ | ------------------------------- |
| `200` / `201` | Success                        | Proceed                         |
| `400`         | Bad request / validation error | Show `message` to user          |
| `401`         | Unauthorized                   | Redirect to login               |
| `403`         | Forbidden (wrong role)         | Show "Access Denied"            |
| `404`         | Not found                      | Show "Not Found"                |
| `500`         | Server error                   | Show generic error, log details |

---

## 12. Important Notes & Gotchas

### 🔑 Tokens

- JWT expires in **7 days** for users, **1 day** for admins.
- Token is in the **`Authorization` response header** — read it with:
  ```javascript
  const token = response.headers.get("Authorization")?.replace("Bearer ", "");
  ```
- Store in `localStorage` or `sessionStorage`. Send on every protected API call.

### 🛒 Cart — Guest vs Logged In

- Cart is only for **authenticated users** (no guest cart via API).
- If you store a local cart for guests, merge it on login by calling `POST /api/cart/add` for each item after OTP verification.

### 📦 Sarees → Size is always `ONE_SIZE`

- Never show a size selector for category `saree`.
- Always pass `"size": "ONE_SIZE"` in cart/wishlist/checkout calls for sarees.

### 💳 Razorpay

- Load Razorpay checkout.js **only on the checkout page** (not globally).
- `amount` from `/api/orders/checkout` is already in **paise** — pass it directly to Razorpay options.
- Always call `/api/orders/verify-payment` from the `handler` callback — never trust Razorpay alone.
- If the user dismisses the modal, no charges are made. Let them retry — call `/api/orders/checkout` again (a new Razorpay order will be created).

### 🚚 Shiprocket

- AWB code (`awbCode`) and courier name (`courierName`) appear in the order response after `verify-payment`.
- AWB assignment is automatic but can fail silently (e.g. no courier serviceable for that pincode). If `awbCode` is `null`, the Shiprocket order still exists — it just needs manual AWB assignment from the Shiprocket dashboard.
- Tracking URL format: `https://shiprocket.co/tracking/{awbCode}`

### 🔒 Admin Role Hierarchy

| Role      | Access                                                           |
| --------- | ---------------------------------------------------------------- |
| `ADMIN`   | Full access — all endpoints                                      |
| `MANAGER` | Users (read), Orders (read), Products (create/update), Dashboard |
| `SUPPORT` | Users (read), Orders (read/update status)                        |
| `USER`    | Customer — cart, wishlist, orders, addresses                     |

### 🖼️ Product Images

- `allImages` is a flat array of all variant image URLs (for thumbnails/listing).
- `variants[n].images` is the per-variant image array (show when color is selected).

### 🔄 Address on Checkout — Both Options Supported

- **Saved address:** pass `{ addressId: "..." }` — fetched from user profile
- **New/one-time address:** pass `{ address: { fullName, phone, addressLine1, city, state, pincode } }` — not saved to profile
- If you want to save AND use in one flow: first `POST /api/auth/addresses`, get the `_id`, then use `addressId` in checkout.

---

## Quick Reference Card

### Customer Website Flow

```
Login (OTP) → Browse Products → Add to Cart/Wishlist →
→ Go to Checkout → Select/Add Address →
→ POST /api/orders/checkout (get RZP order id) →
→ Open Razorpay Modal → Pay →
→ POST /api/orders/verify-payment →
→ Order Confirmation Page (show orderId, awbCode, courierName) →
→ Track Order (using awbCode)
```

### Admin Panel Flow

```
Admin Login → Dashboard Stats →
→ Orders List (filter/search) → Update Status →
→ Products (create/edit/delete) →
→ Users (manage) →
→ Roles (manage permissions)
```
