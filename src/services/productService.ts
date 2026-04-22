import { Product } from "../types";
import { supabase } from "../lib/supabase";

type ProductRow = Omit<Product, "id" | "inStock" | "discountPercent"> & {
  id: number;
  discount_percent: number | null;
  in_stock: boolean;
};

function mapProductRow(item: ProductRow): Product {
  return {
    ...item,
    id: item.id.toString(),
    details: item.details ?? "",
    discountPercent: Number(item.discount_percent ?? 0),
    inStock: item.in_stock,
  };
}

export async function getProducts(): Promise<Product[] | null> {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products from Supabase:", error.message);
    return null;
  }

  // Transform database data to Product type
  return ((data ?? []) as ProductRow[]).map(mapProductRow);
}

export async function insertProduct(product: Product): Promise<Product | null> {
  // Transform product to match database schema
  const dbProduct = {
    id: parseInt(product.id), // Convert string ID to number for bigint column
    name: product.name,
    description: product.description,
    details: product.details,
    price: product.price,
    discount_percent: product.discountPercent ?? 0,
    unit: product.unit,
    category: product.category,
    image: product.image,
    image2: product.image2 || null,
    image3: product.image3 || null,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    in_stock: product.inStock, // Map inStock to in_stock
  };

  const { data, error } = await supabase
    .from("products")
    .insert([dbProduct])
    .select()
    .single();

  if (error) {
    console.error("Error inserting product into Supabase:", error.message);
    return null;
  }

  // Transform back to Product type
  if (data) {
    return mapProductRow(data as ProductRow);
  }

  return null;
}

export async function updateProduct(product: Product): Promise<Product | null> {
  // Transform product to match database schema
  const dbProduct = {
    name: product.name,
    description: product.description,
    details: product.details,
    price: product.price,
    discount_percent: product.discountPercent ?? 0,
    unit: product.unit,
    category: product.category,
    image: product.image,
    image2: product.image2 || null,
    image3: product.image3 || null,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    in_stock: product.inStock, // Map inStock to in_stock
  };

  const { data, error } = await supabase
    .from("products")
    .update(dbProduct)
    .eq("id", parseInt(product.id)) // Convert string ID to number for database query
    .select()
    .single();

  if (error) {
    console.error("Error updating product in Supabase:", error.message);
    return null;
  }

  // Transform back to Product type
  if (data) {
    return mapProductRow(data as ProductRow);
  }

  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    console.error("Error deleting product from Supabase:", error.message);
    return false;
  }

  return true;
}
