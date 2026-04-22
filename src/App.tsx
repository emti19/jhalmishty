import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Benefits } from "./components/Benefits";
import { FarmStory } from "./components/FarmStory";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { CartSidebar } from "./components/CartSidebar";
import { ProductsPage } from "./components/ProductsPage";
import { ProductDetail } from "./components/ProductDetail";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderConfirmationPage } from "./components/OrderConfirmationPage";
import { AdminProducts } from "./components/AdminProducts";
import { AdminLogin } from "./components/AdminLogin";
import { useCart } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import {
  getProducts,
  insertProduct,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "./services/productService";
import { createOrder } from "./services/orderService";
import { Product, Order } from "./types";
import { products as initialProducts } from "./data/products";

function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const { session, loading: authLoading, signOut } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await getProducts();
        if (fetchedProducts !== null) {
          // Use database products (even if empty) - only fallback to local on error
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to load products from database:", error);
        // Keep local products as fallback
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setCartOpen(true);
  };

  const handleAddProduct = async (product: Product) => {
    try {
      const created = await insertProduct(product);
      if (created) {
        setProducts((current) => [created, ...current]);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const updated = await updateProductDb(updatedProduct);
      if (updated) {
        setProducts((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const deleted = await deleteProductDb(id);
      if (deleted) {
        setProducts((current) => current.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleOrderComplete = async (order: Order) => {
    const createdOrder = await createOrder(order);
    clearCart();
    console.log("Order completed:", createdOrder);
    return createdOrder;
  };

  const homePage = (
    <main>
      <Hero />
      <ProductsPage
        products={products}
        onAddToCart={handleAddToCart}
        loading={loadingProducts}
      />
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
                loading={loadingProducts}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage cart={cart} onOrderComplete={handleOrderComplete} />
            }
          />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route
            path="/admin"
            element={
              authLoading ? (
                <div className="pt-24 text-center text-[#334155]">
                  Loading admin access…
                </div>
              ) : session ? (
                <AdminProducts
                  products={products}
                  onAdd={handleAddProduct}
                  onUpdate={handleUpdateProduct}
                  onDelete={handleDeleteProduct}
                  onSignOut={signOut}
                />
              ) : (
                <Navigate replace to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/login"
            element={
              authLoading ? (
                <div className="pt-24 text-center text-[#334155]">
                  Loading admin access…
                </div>
              ) : session ? (
                <Navigate replace to="/admin" />
              ) : (
                <AdminLogin />
              )
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
