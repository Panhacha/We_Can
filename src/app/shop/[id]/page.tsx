import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  // Fetch product from Supabase
  const { data: dbProduct, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !dbProduct) {
    console.error("Product not found:", error);
    notFound();
  }

  // Fetch related products from same category
  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .eq('category', dbProduct.category)
    .neq('id', dbProduct.id)
    .limit(4);

  let product = {
    id: dbProduct.id,
    name: dbProduct.name,
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    category: dbProduct.category,
    subCategory: dbProduct.sub_category || '',
    image: dbProduct.image,
    images: dbProduct.images || [],
    description: dbProduct.description || 'Elevate your everyday style with this premium piece.',
    stock: dbProduct.stock,
    rating: dbProduct.rating ? Number(dbProduct.rating) : 4.5,
    variants: dbProduct.variants || { colors: [], sizes: [], materials: [] }
  };

  const relatedProducts = (relatedData || []).map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image,
    category: p.category,
    status: p.status
  }));

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
