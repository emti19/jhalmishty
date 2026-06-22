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
    <div className="group relative overflow-hidden rounded-2xl border border-[#A8C686]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2F5D50]/8">
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
          <span className="absolute left-2 top-2 rounded-full bg-[#F4A261] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            {product.badge}
          </span>
        )}
        {hasDiscount(product) && (
          <span className="absolute right-2 top-2 rounded-full bg-[#2F5D50] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
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

      <div className="p-3 sm:p-4">
        <h3 className="mb-1 line-clamp-2 text-xs font-semibold leading-snug text-[#1A2E28] sm:text-sm">
          {product.name}
        </h3>

        <p className="mb-2 line-clamp-1 text-xs leading-relaxed text-[#4a6b5f]/70 sm:line-clamp-2 sm:mb-3">
          {product.description}
        </p>

        <div className="mb-2 flex items-center gap-1 sm:mb-3">
          <Star className="h-3 w-3 fill-[#F4A261] text-[#F4A261] sm:h-3.5 sm:w-3.5" />
          <span className="text-xs font-semibold text-[#1A2E28]">
            {product.rating}
          </span>
          <span className="text-xs text-[#4a6b5f]/50">({product.reviews})</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
            <span className="text-sm font-bold text-[#2F5D50] sm:text-base">
              BDT {discountedPrice.toFixed(2)}
            </span>
            {hasDiscount(product) && (
              <span className="text-xs text-[#64748B] line-through">
                BDT {product.price.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-[#4a6b5f]/60">{product.unit}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full rounded-full bg-[#A8C686]/25 py-1.5 text-xs font-medium text-[#2F5D50] transition-all duration-200 hover:bg-[#2F5D50] hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
