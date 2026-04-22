import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import type { DeliveryZone, Order } from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

function getDeliveryZoneLabel(deliveryZone: DeliveryZone) {
  return deliveryZone === "inside_chittagong"
    ? "Inside Chittagong"
    : "Outside Chittagong";
}

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#A8C686]/20">
            <CheckCircle className="h-10 w-10 text-[#2F5D50]" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-[#1A2E28] sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mb-2 text-lg text-[#4a6b5f]">
            Thank you for your order. We&apos;ve received your order and will
            process it shortly.
          </p>
          <p className="text-sm text-[#4a6b5f]/70">Order #{order.id}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-[#1A2E28]">
              Order Details
            </h2>

            <div className="space-y-4">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1A2E28]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#4a6b5f]/60">{product.unit}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-[#475569]">Qty: {quantity}</span>
                      <span className="text-sm font-bold text-[#2F5D50]">
                        BDT {(getDiscountedPrice(product) * quantity).toFixed(2)}
                      </span>
                      {hasDiscount(product) && (
                        <span className="text-xs text-[#64748B] line-through">
                          BDT {(product.price * quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-[#E5E7EB] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#4a6b5f]">Subtotal</span>
                <span className="font-medium text-[#1A2E28]">
                  BDT {order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4a6b5f]">Delivery</span>
                <span className="font-medium text-[#1A2E28]">
                  {order.shipping === 0 ? "Free" : `BDT ${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E5E7EB] pt-2 text-lg font-bold">
                <span className="text-[#1A2E28]">Total</span>
                <span className="text-[#2F5D50]">BDT {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-[#1A2E28]">
                Shipping Address
              </h2>
              <div className="space-y-1 text-sm text-[#4a6b5f]">
                <p className="font-medium text-[#1A2E28]">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 font-medium text-[#1A2E28]">
                  Delivery Area
                </p>
                <p>
                  {getDeliveryZoneLabel(order.shippingAddress.deliveryZone)}
                </p>
                <p className="mt-2">{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-[#1A2E28]">
                Order Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5D50]">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A2E28]">Order Confirmed</p>
                    <p className="text-sm text-[#4a6b5f]">
                      Your order has been received and is being processed.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A8C686]/30">
                    <Package className="h-4 w-4 text-[#2F5D50]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#4a6b5f]">Preparing Order</p>
                    <p className="text-sm text-[#4a6b5f]/70">
                      We&apos;re carefully packing your fresh organic products.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5E7EB]">
                    <Truck className="h-4 w-4 text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#9CA3AF]">Out for Delivery</p>
                    <p className="text-sm text-[#9CA3AF]/70">
                      Expected delivery in 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#2F5D50] p-6 text-white">
              <h3 className="mb-4 text-lg font-bold">What&apos;s Next?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  You&apos;ll receive an email confirmation shortly
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  We&apos;ll send you tracking information once shipped
                </li>
                <li className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Fresh, organic products delivered to your door
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="rounded-full bg-[#2F5D50] px-8 py-3 font-medium text-white transition-colors hover:bg-[#264d43]"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="rounded-full border border-[#2F5D50] px-8 py-3 font-medium text-[#2F5D50] transition-colors hover:bg-[#2F5D50]/5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
