import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discountedPrice = getDiscountedPrice(product);

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#A8C686]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2F5D50]/8">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#F4A261] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        )}
        {hasDiscount(product) && (
          <span className="absolute right-3 top-3 rounded-full bg-[#2F5D50] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            -{product.discountPercent}%
          </span>
        )}
      </Link>

      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onAddToCart(product);
        }}
        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#2F5D50] text-white opacity-0 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#264d43] group-hover:opacity-100"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart className="h-4 w-4" />
      </button>

      <div className="p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-[#1A2E28]">
            {product.name}
          </h3>
        </div>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#4a6b5f]/70">
          {product.description}
        </p>

        <div className="mb-3 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#F4A261] text-[#F4A261]" />
          <span className="text-xs font-semibold text-[#1A2E28]">
            {product.rating}
          </span>
          <span className="text-xs text-[#4a6b5f]/50">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#2F5D50]">
              BDT {discountedPrice.toFixed(2)}
            </span>
            {hasDiscount(product) && (
              <span className="ml-2 text-xs text-[#64748B] line-through">
                BDT {product.price.toFixed(2)}
              </span>
            )}
            <span className="ml-1 text-xs text-[#4a6b5f]/60">{product.unit}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-full bg-[#A8C686]/25 px-3 py-1.5 text-xs font-medium text-[#2F5D50] transition-all duration-200 hover:bg-[#2F5D50] hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
