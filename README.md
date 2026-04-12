# Mahek Sarees - E-commerce Platform

Production-grade E-commerce website built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Fonts:** Playfair Display, Inter, Poppins (Google Fonts)
- **Image Optimization:** Next.js Image component
- **State Management:** React Context (CartWishlistContext)
- **SEO:** Built-in metadata generation & structured data
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
- **Utilities:** clsx, tailwind-merge

## 📁 Project Structure

```
app/
├── cart/                  # Shopping cart page
├── category/[slug]/       # Category listing page
├── forgot-password/       # Forgot password page
├── login/                 # Login page
├── product/[id]/          # Product detail page
├── profile/               # User profile page
├── wishlist/              # Wishlist page
├── layout.tsx             # Root layout
├── page.tsx               # Home page
└── globals.css            # Global styles

src/
├── components/
│   ├── auth/              # Authentication components
│   ├── category/          # Category components
│   ├── empty-states/      # Empty state components
│   ├── layout/            # Layout components (Header, Footer, TopBar, etc.)
│   ├── product/           # Product-related components
│   ├── profile/           # Profile components
│   ├── review/            # Review components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
│   └── CartWishlistContext.tsx
├── constants/             # App constants (routes, categories, site config)
├── data/                  # Mock data (products, reviews)
├── features/              # Feature-based modules
│   ├── auth/              # Authentication features
│   ├── cart/              # Cart features
│   ├── home/              # Landing page sections
│   ├── products/          # Product features
│   ├── reviews/           # Review features
│   └── wishlist/          # Wishlist features
├── lib/
│   ├── api/               # API services
│   ├── structured-data/   # Schema.org structured data generators
│   ├── utils/             # Utility functions (currency, SEO, cn)
│   ├── api-client.ts      # API client configuration
│   ├── api-config.ts      # API configuration
│   ├── api-wrapper.ts     # API wrapper utilities
│   ├── auth-utils.ts      # Authentication utilities
│   ├── base-service.ts    # Base service class
│   ├── fonts.ts           # Font configuration
│   └── toast.ts           # Toast notification utilities
└── types/                 # TypeScript type definitions
```

## 🎨 Design System

All design tokens are centralized in `tailwind.config.js`:

- **Colors:** Primary, secondary, accent, text, background, borders
- **Typography:** Playfair Display (headings), Inter & Poppins (body)
- **Spacing:** Consistent spacing scale
- **Shadows:** Predefined shadow utilities
- **Border Radius:** Standardized radius values

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Copy Images

Copy all images from the HTML project to the Next.js public folder:

```bash
# From: C:\Users\divya\Documents\Pankaj Work\Mahek Saree_html\assets\images\
# To: C:\Users\divya\Documents\Pankaj Work\mahek\public\images\
```

Required images:

- `mahek_sarees_logo.svg`
- `top-slider.png`
- `categories1.png` through `categories5.png`
- `ps1.png` through `ps13.png`
- `flash_salebg.png`
- `free-shipping.svg`, `nochanges.svg`, `card-credit.svg`, `worldshipping.svg`
- `payment.png`
- Category images: `cate1.png` through `cate5.png`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Features

### ✅ Completed

- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Component Architecture:** Fully reusable, DRY components
- **Type Safety:** Strict TypeScript with comprehensive type definitions
- **SEO Optimized:** Metadata generation, structured data, semantic HTML
- **Performance:** Optimized images, code splitting, lazy loading
- **Design System:** Centralized Tailwind theme tokens
- **State Management:** React Context for Cart & Wishlist
- **Authentication:** Login page with form validation
- **Pages Implemented:**
  - Home page with all sections
  - Shopping cart page
  - Wishlist page
  - Product detail page
  - Category listing page
  - User profile page
  - Forgot password page
- **API Integration:** API client with wrapper utilities
- **Toast Notifications:** Sonner integration

### 🔜 Ready for Implementation

- **Authentication:** Signup page, password reset flow
- **Product Pages:** Additional product features
- **Search:** Search functionality
- **Checkout:** Checkout flow
- **Payment Integration:** Stripe/Razorpay
- **Order Tracking:** Order tracking page
- **Admin Panel:** Admin dashboard

## 📦 Components

### UI Components

- `Price` - Price with discount display
- `Rating` - Star rating display
- `TypingPlaceholder` - Placeholder component

### Product Components

- `ProductCard` - Reusable product card with hover effects
- `ProductCarousel` - Product carousel
- `ProductImageGallery` - Product image gallery
- `ReviewsSection` - Reviews section component
- `SizeGuideModal` - Size guide modal
- `StickyCartBar` - Sticky cart bar

### Layout Components

- `Header` - Main navigation with search, cart, wishlist
- `Footer` - Multi-column footer with links
- `TopBar` - Announcement and social links
- `MarqueeBar` - Scrolling promotional messages
- `ProfileDropdown` - User profile dropdown

## 🎨 Styling Guidelines

- **Tailwind Only:** No custom CSS files
- **Design Tokens:** Use theme values from `tailwind.config.js`
- **Responsive:** Mobile-first breakpoints (sm, md, lg, xl)
- **Consistency:** Reuse spacing, colors, and typography tokens

## 📝 TypeScript Types

All types are defined in `src/types/`:

- `product.ts` - Product, ProductCard, ProductLabel, StockStatus
- `cart.ts` - Cart, CartItem, CartState
- `review.ts` - Review, ReviewCard
- `common.ts` - NavLink, FeatureItem, CategoryCard, BannerSlide
- `toast.ts` - Toast notification types

## 🔗 Routes

Defined in `src/constants/routes.ts`:

- `/` - Home
- `/cart` - Shopping cart
- `/category/[slug]` - Category listing
- `/forgot-password` - Forgot password
- `/login` - Login
- `/product/[id]` - Product detail
- `/profile` - User profile
- `/wishlist` - Wishlist

## 🌐 SEO Features

- Dynamic metadata generation
- Open Graph tags
- Twitter Card tags
- Schema.org structured data:
  - Organization
  - Product
  - Breadcrumb
  - Review
- Semantic HTML structure
- Optimized images with alt text

## 🎯 Next Steps

1. **Copy Images:** Transfer all images from HTML project
2. **Install Dependencies:** Run `npm install`
3. **Test Application:** Run `npm run dev`
4. **Add Real Data:** Replace mock data with API integration
5. **Implement Authentication:** Complete signup and password reset flow
6. **Implement Checkout:** Build checkout flow
7. **Payment Gateway:** Integrate Stripe or Razorpay
8. **Deploy:** Deploy to Vercel or your preferred platform

## 📚 Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

Follow the project rules defined in `.windsurf/rules/mahek-rules.md`

## 🌍 Live URLs

| Environment                 | URL                                                                  |
| --------------------------- | -------------------------------------------------------------------- |
| **Production (Storefront)** | [www.maheksarees.in](https://www.maheksarees.in)                     |
| **Staging (Storefront)**    | [staging.maheksarees.in](https://staging.maheksarees.in)             |
| **Production (Admin)**      | [admin.maheksarees.in](https://admin.maheksarees.in)                 |
| **Staging (Admin)**         | [admin.staging.maheksarees.in](https://admin.staging.maheksarees.in) |

## 📄 License

Copyright 2026 © Mahek Sarees All Rights Reserved.
