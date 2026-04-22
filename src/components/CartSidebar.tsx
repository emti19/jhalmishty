import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Cart } from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

interface CartSidebarProps {
  cart: Cart;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
}

const FREE_DELIVERY_THRESHOLD = 2000;

export function CartSidebar({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full transform flex-col bg-[#FAF7F2] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#A8C686]/20 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#2F5D50]" />
            <h2 className="text-lg font-bold text-[#1A2E28]">Your Cart</h2>
            {cart.count > 0 && (
              <span className="rounded-full bg-[#2F5D50] px-2 py-0.5 text-xs font-bold text-white">
                {cart.count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#A8C686]/20"
          >
            <X className="h-4 w-4 text-[#2F5D50]" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A8C686]/20">
              <ShoppingBag className="h-9 w-9 text-[#2F5D50]/40" />
            </div>
            <p className="font-semibold text-[#1A2E28]">Your cart is empty</p>
            <p className="text-sm text-[#4a6b5f]/60">
              Add some fresh organic goodness!
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-[#2F5D50] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#264d43]"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {cart.items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-[#A8C686]/15 bg-white p-3 shadow-sm"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-snug text-[#1A2E28]">
                      {product.name}
                    </p>
                    <p className="mb-2 text-xs text-[#4a6b5f]/60">
                      {product.unit}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full bg-[#FAF7F2] px-1 py-0.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[#A8C686]/30"
                        >
                          <Minus className="h-3 w-3 text-[#2F5D50]" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold text-[#1A2E28]">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[#A8C686]/30"
                        >
                          <Plus className="h-3 w-3 text-[#2F5D50]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2F5D50]">
                          BDT {(getDiscountedPrice(product) * quantity).toFixed(2)}
                        </span>
                        {hasDiscount(product) && (
                          <span className="text-xs text-[#64748B] line-through">
                            BDT {(product.price * quantity).toFixed(2)}
                          </span>
                        )}
                        <button
                          onClick={() => onRemove(product.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#4a6b5f]/40 transition-colors hover:bg-red-50 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#A8C686]/20 bg-white px-6 py-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-[#4a6b5f]">Subtotal</span>
                <span className="font-bold text-[#1A2E28]">
                  BDT {cart.total.toFixed(2)}
                </span>
              </div>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-[#4a6b5f]">Delivery</span>
                <span className="text-sm font-medium text-[#2F5D50]">
                  {cart.total >= FREE_DELIVERY_THRESHOLD
                    ? "Free"
                    : "BDT 70-120 at checkout"}
                </span>
              </div>
              {cart.total < FREE_DELIVERY_THRESHOLD && (
                <p className="mb-4 text-center text-xs text-[#F4A261]">
                  Add BDT {(FREE_DELIVERY_THRESHOLD - cart.total).toFixed(2)} more
                  for free delivery!
                </p>
              )}
              <Link
                to="/checkout"
                onClick={() => {
                  onClose();
                  onCheckout?.();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2F5D50] py-3.5 font-semibold text-white transition-all duration-200 hover:bg-[#264d43] hover:shadow-lg hover:shadow-[#2F5D50]/20"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
