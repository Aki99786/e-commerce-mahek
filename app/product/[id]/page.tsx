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
    
    return {
      title: `${product.name} - ${product.brand} | Mahek`,
      description: product.description || `Shop ${product.name} by ${product.brand}. ${product.fabric} fabric with ${product.pattern} pattern.`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.allImages.slice(0, 4),
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
