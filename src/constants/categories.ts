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

export interface CategoryItem {
  id: string;
  name: string;
  slug: CategoryEnum | string;
  image: string;
  video?: string;
  count?: string;
}

export const CATEGORIES: readonly CategoryItem[] = [
  {
    id: "banarasi-saree",
    name: "Banarasi Sarees",
    slug: CategoryEnum.BANARASI_SAREES,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/39302121-d1e1-4376-9ddf-ecee89f1959b.png",
    count: "94 SILKS",
  },
  {
    id: "saree",
    name: "Sarees",
    slug: CategoryEnum.SAREES,
    image: " https://storage.googleapis.com/mahek_saree_staging/products/511c494b-5d95-404c-89bf-76172999893e.png",
    count: "110 WEAVES",
  },
  {
    id: "lehenga",
    name: "Lehenga",
    slug: CategoryEnum.LEHENGA,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/5595eae9-45fd-43d7-a338-7995c1bc442c.png",
    count: "128 ENSEMBLES",
  },
  {
    id: "rajputi-poshak",
    name: "Rajputi Poshak",
    slug: CategoryEnum.RAJPUTI_POSHAK,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/f87ac66d-9f7b-4668-88de-c82f7064738b.png",
    count: "46 EDITIONS",
  },
  {
    id: "bridal-lehenga",
    name: "Bridal Lehenga",
    slug: CategoryEnum.BRIDAL_LEHENGA,
    image: "https://storage.googleapis.com/mahek_saree_staging/products/5595eae9-45fd-43d7-a338-7995c1bc442c.png",
    count: "72 OUTFITS",
  },
] as const;
