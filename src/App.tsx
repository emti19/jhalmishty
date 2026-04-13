import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { FarmStory } from './components/FarmStory';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { AdminProducts } from './components/AdminProducts';
import { ProductsPage } from './components/ProductsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { useCart } from './hooks/useCart';
import { Product } from './types';
import { Order } from './types';
import { products as initialProducts } from './data/products';

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') {
      return initialProducts;
    }

    try {
      const saved = localStorage.getItem('products');
      return saved ? JSON.parse(saved) as Product[] : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartOpen(true);
  };

  const handleAddProduct = (product: Product) => {
    setProducts((current) => [product, ...current]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((current) => current.map((item) => item.id === updatedProduct.id ? updatedProduct : item));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((current) => current.filter((item) => item.id !== id));
  };

  const handleOrderComplete = (order: Order) => {
    // Clear the cart after successful order
    // Note: In a real app, you'd want to persist orders to a backend
    console.log('Order completed:', order);
    clearCart();
  };

  const homePage = (
    <main>
      <Hero />
      <Benefits />
      <FarmStory />
      <Testimonials />
      {/* <Newsletter /> */}
    </main>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF7F2]">
        <Header cart={cart} onCartOpen={() => setCartOpen(true)} />

        <Routes>
          <Route path="/" element={homePage} />
          <Route
            path="/products"
            element={
              <ProductsPage
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                onOrderComplete={handleOrderComplete}
              />
            }
          />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route
            path="/admin"
            element={
              <AdminProducts
                products={products}
                onAdd={handleAddProduct}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

        <Footer />

        <CartSidebar
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
