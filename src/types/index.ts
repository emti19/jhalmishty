export interface Product {
  id: string;
  name: string;
  description: string;
  details?: string;
  price: number;
  unit: string;
  category: Category;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export type Category =
  | "fruits"
  | "vegetables"
  | "dairy"
  | "grains"
  | "herbs"
  | "pantry";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "paypal" | "bank";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}
