import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, ZoomIn, X } from "lucide-react";
import { Product } from "../types";

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ products, onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const detailsText = product?.details || product?.description || "";

  // Get all available images
  const images = product
    ? [product.image, product.image2, product.image3].filter(
        (img) => img !== undefined && img !== ""
      )
    : [];

  const mainImage = images[mainImageIndex] || product?.image;

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#1A2E28] mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to products
          </button>
          <div className="rounded-3xl border border-[#A8C686]/20 bg-white p-12 shadow-sm">
            <h1 className="text-3xl font-bold text-[#1A2E28] mb-4">
              Product not found
            </h1>
            <p className="text-[#4a6b5f] mb-8">
              The product you are looking for does not exist or has been
              removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#2F5D50] text-white px-6 py-3 rounded-xl hover:bg-[#264d43] transition-colors"
            >
              Browse products
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setQuantity(1);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#1A2E28] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div className="space-y-6">
            <div
              className="relative aspect-square overflow-hidden rounded-[2rem] border border-[#A8C686]/15 bg-white shadow-sm"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transition: "transform 0.1s ease-out",
                      }
                    : {
                        transform: "scale(1)",
                        transition: "transform 0.2s ease-out",
                      }
                }
              />
              {isZoomed && (
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-sm text-white">
                  <ZoomIn className="w-4 h-4" />
                  Zoom view
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      mainImageIndex === index
                        ? "border-[#2F5D50] ring-2 ring-[#2F5D50]/30"
                        : "border-[#A8C686]/15 hover:border-[#A8C686]/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="text-[#4a6b5f] mb-2">Category</p>
                <p className="font-semibold text-[#1A2E28] capitalize">
                  {product.category}
                </p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="text-[#4a6b5f] mb-2">Unit</p>
                <p className="font-semibold text-[#1A2E28]">{product.unit}</p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="text-[#4a6b5f] mb-2">Rating</p>
                <p className="font-semibold text-[#1A2E28]">
                  {product.rating} / 5
                </p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="text-[#4a6b5f] mb-2">Reviews</p>
                <p className="font-semibold text-[#1A2E28]">
                  {product.reviews}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-[2rem] border border-[#A8C686]/15 bg-white p-8 shadow-sm">
            <div>
              <h1 className="text-4xl font-bold text-[#1A2E28] mb-3">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#4a6b5f]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F4A261]/10 px-3 py-2 text-[#1A2E28]">
                  <Star className="w-4 h-4 fill-[#F4A261] text-[#F4A261]" />
                  {product.rating}
                </div>
                <span>{product.reviews} reviews</span>
                <span
                  className={
                    product.inStock ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#A8C686]/15 bg-[#FAF7F2] p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[#4a6b5f]">Price</p>
                  <p className="text-4xl font-bold text-[#2F5D50]">
                    ৳{product.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-[#4a6b5f]">{product.unit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1A2E28] mb-3">
                  Description
                </h2>
                <p className="text-[#4a6b5f] leading-relaxed whitespace-pre-line">
                  {detailsText}
                </p>
              </div>

              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-4">
                <p className="text-xs text-[#4a6b5f] mb-2">Shipping</p>
                <p className="font-semibold text-[#1A2E28]">
                  Free shipping on orders over ৳500
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#1A2E28]">
                  Quantity
                </span>
                <div className="flex items-center rounded-full border border-[#A8C686]/25 bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-[#2F5D50] hover:bg-[#A8C686]/10 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 text-[#1A2E28] font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-[#2F5D50] hover:bg-[#A8C686]/10 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full rounded-3xl bg-[#2F5D50] px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#264d43] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
