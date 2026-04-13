import { redirect } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  redirect(`/products?category=${slug}`);
}
