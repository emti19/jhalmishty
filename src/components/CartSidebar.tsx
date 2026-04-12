import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Cart } from '../types';

interface CartSidebarProps {
  cart: Cart;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartSidebar({ cart, isOpen, onClose, onUpdateQuantity, onRemove }: CartSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#A8C686]/20">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#2F5D50]" />
            <h2 className="font-bold text-[#1A2E28] text-lg">Your Cart</h2>
            {cart.count > 0 && (
              <span className="bg-[#2F5D50] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#A8C686]/20 transition-colors"
          >
            <X className="w-4 h-4 text-[#2F5D50]" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 bg-[#A8C686]/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-[#2F5D50]/40" />
            </div>
            <p className="font-semibold text-[#1A2E28]">Your cart is empty</p>
            <p className="text-sm text-[#4a6b5f]/60">Add some fresh organic goodness!</p>
            <button
              onClick={onClose}
              className="mt-2 bg-[#2F5D50] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#264d43] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 bg-white rounded-2xl p-3 shadow-sm border border-[#A8C686]/15">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A2E28] leading-snug truncate">{product.name}</p>
                    <p className="text-xs text-[#4a6b5f]/60 mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-full px-1 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#A8C686]/30 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-[#2F5D50]" />
                        </button>
                        <span className="text-sm font-semibold text-[#1A2E28] w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#A8C686]/30 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[#2F5D50]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2F5D50]">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemove(product.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-[#4a6b5f]/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-[#A8C686]/20 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#4a6b5f]">Subtotal</span>
                <span className="font-bold text-[#1A2E28]">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm text-[#4a6b5f]">Delivery</span>
                <span className="text-sm font-medium text-[#2F5D50]">
                  {cart.total >= 50 ? 'Free' : '$5.99'}
                </span>
              </div>
              {cart.total < 50 && (
                <p className="text-xs text-center text-[#F4A261] mb-4">
                  Add ${(50 - cart.total).toFixed(2)} more for free delivery!
                </p>
              )}
              <button className="w-full bg-[#2F5D50] hover:bg-[#264d43] text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#2F5D50]/20">
                Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
