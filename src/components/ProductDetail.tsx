import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, ZoomIn } from "lucide-react";
import type { Product } from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ products, onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const detailsText = product?.details || product?.description || "";

  const images = product
    ? [product.image, product.image2, product.image3].filter(
        (image): image is string => Boolean(image),
      )
    : [];

  const mainImage = images[mainImageIndex] || product?.image;

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] pt-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/products")}
            className="mb-8 inline-flex items-center gap-2 font-medium text-[#2F5D50] transition-colors hover:text-[#1A2E28]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to products
          </button>
          <div className="rounded-3xl border border-[#A8C686]/20 bg-white p-12 shadow-sm">
            <h1 className="mb-4 text-3xl font-bold text-[#1A2E28]">
              Product not found
            </h1>
            <p className="mb-8 text-[#4a6b5f]">
              The product you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="rounded-xl bg-[#2F5D50] px-6 py-3 text-white transition-colors hover:bg-[#264d43]"
            >
              Browse products
            </button>
          </div>
        </div>
      </main>
    );
  }

  const discountedPrice = getDiscountedPrice(product);

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
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
    <main className="min-h-screen bg-[#FAF7F2] pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/products")}
          className="mb-8 inline-flex items-center gap-2 font-medium text-[#2F5D50] transition-colors hover:text-[#1A2E28]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to products
        </button>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
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
                className="h-full w-full object-cover"
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
                  <ZoomIn className="h-4 w-4" />
                  Zoom view
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setMainImageIndex(index)}
                    className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all ${
                      mainImageIndex === index
                        ? "border-[#2F5D50] ring-2 ring-[#2F5D50]/30"
                        : "border-[#A8C686]/15 hover:border-[#A8C686]/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="mb-2 text-[#4a6b5f]">Category</p>
                <p className="font-semibold capitalize text-[#1A2E28]">
                  {product.category}
                </p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="mb-2 text-[#4a6b5f]">Unit</p>
                <p className="font-semibold text-[#1A2E28]">{product.unit}</p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="mb-2 text-[#4a6b5f]">Rating</p>
                <p className="font-semibold text-[#1A2E28]">
                  {product.rating} / 5
                </p>
              </div>
              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-5 text-sm">
                <p className="mb-2 text-[#4a6b5f]">Reviews</p>
                <p className="font-semibold text-[#1A2E28]">{product.reviews}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-[2rem] border border-[#A8C686]/15 bg-white p-8 shadow-sm">
            <div>
              <h1 className="mb-3 text-4xl font-bold text-[#1A2E28]">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#4a6b5f]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F4A261]/10 px-3 py-2 text-[#1A2E28]">
                  <Star className="h-4 w-4 fill-[#F4A261] text-[#F4A261]" />
                  {product.rating}
                </div>
                <span>{product.reviews} reviews</span>
                {hasDiscount(product) && (
                  <span className="rounded-full bg-[#2F5D50]/10 px-3 py-2 font-semibold text-[#2F5D50]">
                    Save {product.discountPercent}%
                  </span>
                )}
                <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#A8C686]/15 bg-[#FAF7F2] p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[#4a6b5f]">Price</p>
                  <p className="text-4xl font-bold text-[#2F5D50]">
                    BDT {discountedPrice.toFixed(2)}
                  </p>
                  {hasDiscount(product) && (
                    <p className="mt-2 text-sm text-[#64748B]">
                      <span className="line-through">
                        BDT {product.price.toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
                <p className="text-sm text-[#4a6b5f]">{product.unit}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="mb-3 text-xl font-semibold text-[#1A2E28]">
                  Description
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-[#4a6b5f]">
                  {detailsText}
                </p>
              </div>

              <div className="rounded-3xl border border-[#A8C686]/15 bg-white p-4">
                <p className="mb-2 text-xs text-[#4a6b5f]">Shipping</p>
                <p className="font-semibold text-[#1A2E28]">
                  Free delivery on orders of BDT 2,000 or more
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#1A2E28]">
                  Quantity
                </span>
                <div className="flex items-center overflow-hidden rounded-full border border-[#A8C686]/25 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-[#2F5D50] transition-colors hover:bg-[#A8C686]/10"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-semibold text-[#1A2E28]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-[#2F5D50] transition-colors hover:bg-[#A8C686]/10"
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
                  <ShoppingCart className="h-5 w-5" />
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
