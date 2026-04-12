import { useState } from 'react';
import { Product } from '../types';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-16 lg:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#4a6b5f]">
            <p className="text-lg font-medium">No products in this category yet.</p>
            <p className="text-sm mt-2 opacity-60">Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
