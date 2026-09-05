import { notFound } from "next/navigation";
import { productService } from "@/features/products/services/product.service";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const product = await productService.getProductById(id);
    const images =
      product.product_variants?.[0]?.images ||
      product.variant?.images ||
      [];
    
    return {
      title: `${product.product_name} - ${product.brand} | Mahek`,
      description: product.description || `Shop ${product.product_name} by ${product.brand}.`,
      openGraph: {
        title: product.product_name,
        description: product.description,
        images: images.slice(0, 4),
      },
    };
  } catch {
    return {
      title: "Product Not Found | Mahek",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  let product;
  try {
    product = await productService.getProductById(id);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
