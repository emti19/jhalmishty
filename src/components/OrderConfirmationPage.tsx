import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { Order } from '../types';

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#A8C686]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#2F5D50]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E28] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-[#4a6b5f] mb-2">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
          <p className="text-sm text-[#4a6b5f]/70">
            Order #{order.id}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Details */}
          <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6">
            <h2 className="text-xl font-bold text-[#1A2E28] mb-6">Order Details</h2>

            <div className="space-y-4">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A2E28]">{product.name}</p>
                    <p className="text-xs text-[#4a6b5f]/60">{product.unit}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-[#475569]">Qty: {quantity}</span>
                      <span className="text-sm font-bold text-[#2F5D50]">
                        ৳{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E5E7EB] mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#4a6b5f]">Subtotal</span>
                <span className="font-medium text-[#1A2E28]">৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4a6b5f]">Shipping</span>
                <span className="font-medium text-[#1A2E28]">৳{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4a6b5f]">Tax</span>
                <span className="font-medium text-[#1A2E28]">৳{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E5E7EB]">
                <span className="text-[#1A2E28]">Total</span>
                <span className="text-[#2F5D50]">৳{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6">
              <h2 className="text-xl font-bold text-[#1A2E28] mb-6">Shipping Address</h2>
              <div className="text-sm text-[#4a6b5f] space-y-1">
                <p className="font-medium text-[#1A2E28]">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6">
              <h2 className="text-xl font-bold text-[#1A2E28] mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2F5D50] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2E28]">Order Confirmed</p>
                    <p className="text-sm text-[#4a6b5f]">Your order has been received and is being processed.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#A8C686]/30 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#2F5D50]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#4a6b5f]">Preparing Order</p>
                    <p className="text-sm text-[#4a6b5f]/70">We're carefully packing your fresh organic products.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E5E7EB] rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#9CA3AF]">Out for Delivery</p>
                    <p className="text-sm text-[#9CA3AF]/70">Expected delivery in 2-3 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#2F5D50] rounded-3xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">What's Next?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  You'll receive an email confirmation shortly
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  We'll send you tracking information once shipped
                </li>
                <li className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Fresh, organic products delivered to your door
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/products"
              className="bg-[#2F5D50] hover:bg-[#264d43] text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="border border-[#2F5D50] text-[#2F5D50] px-8 py-3 rounded-full font-medium hover:bg-[#2F5D50]/5 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}