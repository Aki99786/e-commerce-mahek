import type { Product } from "@/types/product";
import { ProductLabelType, StockStatus } from "@/types/product";
import { CategoryEnum, CategorySlugEnum } from "@/constants/categories";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold",
    slug: "luxurious-hand-embellished-festive-lehenga-red-gold",
    shortDescription:
      "Enhance your festive elegance with this exquisitely crafted red and gold embroidered lehenga set. The outfit features a richly detailed blouse adorned with intricate gold zari and sequin work. The lehenga is designed to add a touch of glamour with shimmering accents, and a graceful flare that moves effortlessly with every step. Paired with a soft, sheer red dupatta bordered with complementary embroidery, this ensemble exudes traditional charm with a modern appeal. Perfect for weddings, receptions, festive celebrations, and special occasions, this lehenga promises a stunning and regal appearance.",
    description:
      "Enhance your festive elegance with this exquisitely crafted red and gold embroidered lehenga set. The outfit features a richly detailed blouse adorned with intricate gold zari and sequin work. The lehenga is designed to add a touch of glamour with shimmering accents, and a graceful flare that moves effortlessly with every step. Paired with a soft, sheer red dupatta bordered with complementary embroidery, this ensemble exudes traditional charm with a modern appeal. Perfect for weddings, receptions, festive celebrations, and special occasions, this lehenga promises a stunning and regal appearance.",
    images: [
      {
        url: "/images/pd1.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 1",
      },
      {
        url: "/images/pd2.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 2",
      },
      {
        url: "/images/pd3.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 3",
      },
      {
        url: "/images/pd4.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 4",
      },
      {
        url: "/images/pd5.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 5",
      },
      {
        url: "/images/pd6.jpg",
        alt: "Luxurious Hand-Embellished Festive Lehenga in Red & Gold - View 6",
      },
    ],
    price: {
      current: 14500,
      original: 19900,
      discount: 27,
    },
    rating: {
      average: 4,
      count: 16,
    },
    category: CategoryEnum.BRIDAL_LEHENGA,
    categorySlug: CategorySlugEnum.BRIDAL_LEHENGA,
    label: {
      type: ProductLabelType.NEW,
      text: "NEW",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
    sku: "1416PT-1",
    fabric: "Viscose",
    colors: [
      { name: "RED & GOLD", image: "/images/pd1.jpg", available: true },
      { name: "BEIGE & GOLD", image: "/images/pd2.jpg", available: true },
      { name: "BLUE & SILVER", image: "/images/pd3.jpg", available: true },
    ],
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: true },
      { name: "XXL", available: false },
    ],
    features: [
      "Premium quality embroidery with detailed zari and sequin work",
      "Heavy embellished lehenga with rich texture and elegant flare",
      "Stylish, intricately designed blouse for a flattering fit",
      "Soft net dupatta with an embroidered border",
      "Ideal for brides, bridesmaids, and festive events",
    ],
    washingInstructions: {
      embroideredSuits: "Dry clean Only",
      printedCotton: "Gentle dip wash with mild Detergent",
      disclaimer:
        "Color variations may occur due to different screen resolution or photographic lights.",
    },
    deliveryInfo: {
      estimatedDate: "Wed, Jan 14 and Tue, Jan 15",
      peopleViewing: 21,
    },
    reviews: [
      {
        id: "1",
        rating: 4,
        title: "Lorem ipsum dolor sit amet",
        comment:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        author: "Avone",
        date: "Apr 09, 2021",
        verified: true,
      },
      {
        id: "2",
        rating: 3,
        title: "Simply text of the printing",
        comment:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        author: "Diva",
        date: "May 30, 2021",
        verified: false,
      },
      {
        id: "3",
        rating: 2,
        title: "Neque porro quisquam est qui dolorem ipsum",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
        author: "Belle",
        date: "Dec 30, 2021",
        verified: true,
      },
      {
        id: "4",
        rating: 5,
        title: "Excellent quality and beautiful design",
        comment:
          "The lehenga exceeded my expectations! The embroidery work is stunning and the fabric quality is top-notch. Perfect for my sister's wedding. Highly recommend!",
        author: "Priya",
        date: "Jan 15, 2022",
        verified: true,
      },
      {
        id: "5",
        rating: 4,
        title: "Great value for money",
        comment:
          "Beautiful lehenga with intricate work. The color is exactly as shown in pictures. Only minor issue was the delivery took slightly longer than expected.",
        author: "Sneha",
        date: "Feb 20, 2022",
        verified: true,
      },
      {
        id: "6",
        rating: 5,
        title: "Perfect bridal outfit",
        comment:
          "Absolutely gorgeous! The gold work is exquisite and the fit is perfect. Received so many compliments at the wedding. Worth every penny!",
        author: "Aisha",
        date: "Mar 05, 2022",
        verified: true,
      },
    ],
  },
  {
    id: "2",
    name: "Navy Blue Shimmer Silk Heavy Embroidery Saree",
    slug: "navy-blue-shimmer-silk-saree",
    shortDescription: "Heavy embroidery work on premium silk",
    images: [{ url: "/images/ps2.png", alt: "Navy Blue Shimmer Silk Saree" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 18,
    },
    category: CategoryEnum.SAREES,
    categorySlug: CategorySlugEnum.SAREES,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
  },
  {
    id: "3",
    name: "Black Fully Stretchable Imported Saree",
    slug: "black-stretchable-imported-saree",
    shortDescription: "Comfortable stretchable fabric with modern design",
    images: [
      { url: "/images/ps3.png", alt: "Black Stretchable Imported Saree" },
    ],
    price: {
      current: 4350.0,
      original: 4850.0,
    },
    rating: {
      average: 4,
      count: 32,
    },
    category: CategoryEnum.SAREES,
    categorySlug: CategorySlugEnum.SAREES,
    label: {
      type: ProductLabelType.PRE_ORDER,
      text: "Pre-Order",
    },
    stockStatus: StockStatus.PRE_ORDER,
    bestseller: true,
  },
  {
    id: "4",
    name: "Red Designer Bridal Lehenga",
    slug: "red-designer-bridal-lehenga",
    shortDescription: "Stunning bridal lehenga with intricate work",
    images: [{ url: "/images/ps4.png", alt: "Red Designer Bridal Lehenga" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 15,
    },
    category: CategoryEnum.BRIDAL_LEHENGA,
    categorySlug: CategorySlugEnum.BRIDAL_LEHENGA,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
  },
  {
    id: "5",
    name: "Pink Embroidered Lehenga Choli",
    slug: "pink-embroidered-lehenga",
    shortDescription: "Beautiful pink lehenga with detailed embroidery",
    images: [{ url: "/images/ps5.png", alt: "Pink Embroidered Lehenga" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 28,
    },
    category: CategoryEnum.LEHENGA,
    categorySlug: CategorySlugEnum.LEHENGA,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
    trending: true,
  },
  {
    id: "6",
    name: "Maroon Banarasi Silk Saree",
    slug: "maroon-banarasi-silk-saree",
    shortDescription: "Traditional Banarasi silk with golden zari work",
    images: [{ url: "/images/ps6.png", alt: "Maroon Banarasi Silk Saree" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 42,
    },
    category: CategoryEnum.BANARASI_SAREES,
    categorySlug: CategorySlugEnum.BANARASI_SAREES,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
    trending: true,
  },
  {
    id: "7",
    name: "Green Traditional Rajputi Poshak",
    slug: "green-rajputi-poshak",
    shortDescription: "Authentic Rajasthani traditional wear",
    images: [{ url: "/images/ps7.png", alt: "Green Rajputi Poshak" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 19,
    },
    category: CategoryEnum.RAJPUTI_POSHAK,
    categorySlug: CategorySlugEnum.RAJPUTI_POSHAK,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
    trending: true,
  },
  {
    id: "8",
    name: "Blue Designer Lehenga Set",
    slug: "blue-designer-lehenga-set",
    shortDescription: "Contemporary lehenga with modern aesthetics",
    images: [{ url: "/images/ps8.png", alt: "Blue Designer Lehenga" }],
    price: {
      current: 4350.0,
      original: 4850.0,
      discount: 10,
    },
    rating: {
      average: 4,
      count: 36,
    },
    category: CategoryEnum.LEHENGA,
    categorySlug: CategorySlugEnum.LEHENGA,
    label: {
      type: ProductLabelType.SALE,
      text: "-10%",
    },
    stockStatus: StockStatus.IN_STOCK,
    bestseller: true,
    trending: true,
  },
];
