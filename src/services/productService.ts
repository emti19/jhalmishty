import { Product } from '../types';
import { supabase } from '../lib/supabase';

export async function getProducts(): Promise<Product[] | null> {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products from Supabase:', error.message);
    return null;
  }

  // Transform database data to Product type
  return (data as any[])?.map(item => ({
    ...item,
    id: item.id.toString(), // Convert bigint ID to string
    inStock: item.in_stock, // Map in_stock to inStock
  })) ?? [];
}

export async function insertProduct(product: Product): Promise<Product | null> {
  // Transform product to match database schema
  const dbProduct = {
    id: parseInt(product.id), // Convert string ID to number for bigint column
    name: product.name,
    description: product.description,
    price: product.price,
    unit: product.unit,
    category: product.category,
    image: product.image,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    in_stock: product.inStock, // Map inStock to in_stock
  };

  const { data, error } = await supabase
    .from('products')
    .insert([dbProduct])
    .select()
    .single();

  if (error) {
    console.error('Error inserting product into Supabase:', error.message);
    return null;
  }

  // Transform back to Product type
  if (data) {
    return {
      ...data,
      id: data.id.toString(), // Convert back to string for Product type
      inStock: data.in_stock, // Map back to inStock
    } as Product;
  }

  return null;
}

export async function updateProduct(product: Product): Promise<Product | null> {
  // Transform product to match database schema
  const dbProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    unit: product.unit,
    category: product.category,
    image: product.image,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    in_stock: product.inStock, // Map inStock to in_stock
  };

  const { data, error } = await supabase
    .from('products')
    .update(dbProduct)
    .eq('id', parseInt(product.id)) // Convert string ID to number for database query
    .select()
    .single();

  if (error) {
    console.error('Error updating product in Supabase:', error.message);
    return null;
  }

  // Transform back to Product type
  if (data) {
    return {
      ...data,
      id: data.id.toString(), // Convert back to string for Product type
      inStock: data.in_stock, // Map back to inStock
    } as Product;
  }

  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', parseInt(id));

  if (error) {
    console.error('Error deleting product from Supabase:', error.message);
    return false;
  }

  return true;
}