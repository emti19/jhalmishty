import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { ProductGrid } from './components/ProductGrid';
import { FarmStory } from './components/FarmStory';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { useCart } from './hooks/useCart';
import { Product } from './types';

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header cart={cart} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero />
        <Benefits />
        <ProductGrid onAddToCart={handleAddToCart} />
        <FarmStory />
        <Testimonials />
        <Newsletter />
      </main>

      <Footer />

      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
}

export default App;
