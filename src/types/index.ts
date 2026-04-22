export interface Product {
  id: string;
  name: string;
  description: string;
  details?: string;
  price: number;
  discountPercent?: number;
  unit: string;
  category: Category;
  image: string;
  image2?: string;
  image3?: string;
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
  state?: string;
  zipCode?: string;
  country: string;
  deliveryZone: DeliveryZone;
}

export type PaymentMethod = "cod" | "bkash" | "bank";

export type DeliveryZone = "inside_chittagong" | "outside_chittagong";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}
