import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#2F5D50]/8 transition-all duration-300 hover:-translate-y-1 border border-[#A8C686]/15">
      <Link
        to={`/product/${product.id}`}
        className="relative overflow-hidden aspect-[4/3] block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#F4A261] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="absolute bottom-3 right-3 w-10 h-10 bg-[#2F5D50] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#264d43] hover:scale-110 shadow-lg"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart className="w-4 h-4" />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-[#1A2E28] text-sm leading-snug">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-[#4a6b5f]/70 leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
          <span className="text-xs font-semibold text-[#1A2E28]">
            {product.rating}
          </span>
          <span className="text-xs text-[#4a6b5f]/50">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#2F5D50]">
              ৳{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-[#4a6b5f]/60 ml-1">
              {product.unit}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="text-xs font-medium bg-[#A8C686]/25 hover:bg-[#2F5D50] hover:text-white text-[#2F5D50] px-3 py-1.5 rounded-full transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
