export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: Category;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export type Category = 'fruits' | 'vegetables' | 'dairy' | 'grains' | 'herbs' | 'pantry';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}
