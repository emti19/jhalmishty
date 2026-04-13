import { ProductGrid } from './ProductGrid';
import { Product } from '../types';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading?: boolean;
}

export function ProductsPage({ products, onAddToCart, loading = false }: ProductsPageProps) {
  return (
    <main className=" ">
      <ProductGrid products={products} onAddToCart={onAddToCart} loading={loading} />
    </main>
  );
}