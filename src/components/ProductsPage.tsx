import { ProductGrid } from './ProductGrid';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductsPage({ products, onAddToCart }: ProductsPageProps) {
  return (
    <main className="pt-24 pb-16 lg:pt-32 lg:pb-24">
      <ProductGrid products={products} onAddToCart={onAddToCart} />
    </main>
  );
}