import { useState, useCallback } from 'react';
import { Cart, CartItem, Product } from '../types';

const initialCart: Cart = {
  items: [],
  total: 0,
  count: 0,
};

function computeCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, total, count };
}

export function useCart() {
  const [cart, setCart] = useState<Cart>(initialCart);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prev.items, { product, quantity: 1 }];
      }
      return computeCart(newItems);
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.product.id !== productId);
      return computeCart(newItems);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const newItems = prev.items.filter((i) => i.product.id !== productId);
        return computeCart(newItems);
      }
      const newItems = prev.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      return computeCart(newItems);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(initialCart);
  }, []);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
}
