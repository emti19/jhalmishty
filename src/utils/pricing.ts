import type { Product } from "../types";

export function normalizeDiscountPercent(discountPercent?: number) {
  if (!Number.isFinite(discountPercent)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Number(discountPercent)));
}

export function getDiscountedPrice(product: Product) {
  const discountPercent = normalizeDiscountPercent(product.discountPercent);
  const discountedPrice = product.price * (1 - discountPercent / 100);

  return Number(discountedPrice.toFixed(2));
}

export function hasDiscount(product: Product) {
  return normalizeDiscountPercent(product.discountPercent) > 0;
}
