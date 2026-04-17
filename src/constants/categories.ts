export enum CategorySlugEnum {
  SAREES = "sarees",
  BANARASI_SAREES = "banarasi-sarees",
  LEHENGA = "lehenga",
  RAJPUTI_POSHAK = "rajputi-poshak",
  BRIDAL_LEHENGA = "bridal-lehenga",
}

export enum CategoryEnum {
  SAREES = "Saree",
  BANARASI_SAREES = "Banarasi Sarees",
  LEHENGA = "Lehenga",
  RAJPUTI_POSHAK = "Rajputi Poshak",
  BRIDAL_LEHENGA = "Bridal Lehenga",
}

export const CATEGORIES = [
  {
    id: "banarasi-sarees",
    name: "Banarasi Sarees",
    slug: CategoryEnum.BANARASI_SAREES,
    image: "/images/categories1.png",
  },
  {
    id: "sarees",
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
