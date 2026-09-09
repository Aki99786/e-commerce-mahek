export enum CategorySlugEnum {
  SAREES = "saree",
  BANARASI_SAREES = "banarasi-saree",
  LEHENGA = "lehenga",
  RAJPUTI_POSHAK = "rajputi-poshak",
  BRIDAL_LEHENGA = "bridal-lehenga",
}

export enum CategoryEnum {
  SAREES = "saree",
  BANARASI_SAREES = "banarasi-saree",
  LEHENGA = "lehenga",
  RAJPUTI_POSHAK = "rajputi-poshak",
  BRIDAL_LEHENGA = "bridal-lehenga",
}

export const CATEGORIES = [
  {
    id: "banarasi-saree",
    name: "Banarasi Sarees",
    slug: CategoryEnum.BANARASI_SAREES,
    image: "/images/categories1.png",
  },
  {
    id: "saree",
    name: "Sarees",
    slug: CategoryEnum.SAREES,
    image: "/images/categories2.png",
  },
  {
    id: "lehenga",
    name: "Lehenga",
    slug: CategoryEnum.LEHENGA,
    image: "/images/categories3.png",
  },
  {
    id: "rajputi-poshak",
    name: "Rajputi Poshak",
    slug: CategoryEnum.RAJPUTI_POSHAK,
    image: "/images/categories4.png",
  },
  {
    id: "bridal-lehenga",
    name: "Bridal Lehenga",
    slug: CategoryEnum.BRIDAL_LEHENGA,
    image: "/images/categories5.png",
  },
] as const;
