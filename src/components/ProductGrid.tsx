import { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading?: boolean;
}

export function ProductGrid({ products, onAddToCart, loading = false }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="bg-[#FAF7F2]">
      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[#F4A261] font-medium text-sm mb-2 tracking-wide uppercase">
              Our Products
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2E28]">
              Seasonal Selections
            </h2>
          </div>
          <p className="text-[#4a6b5f] text-sm max-w-xs">
            Handpicked organic goodness, delivered fresh to your doorstep.
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))
          )}
        </div>

        {filtered.length === 0 && (
          <div className="text-center   text-[#4a6b5f]">
            <p className="text-lg font-medium">No products in this category yet.</p>
            <p className="text-sm mt-2 opacity-60">Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
