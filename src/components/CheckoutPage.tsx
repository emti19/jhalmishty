import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
import type {
  Cart,
  DeliveryZone,
  Order,
  PaymentMethod,
  ShippingAddress,
} from "../types";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

interface CheckoutPageProps {
  cart: Cart;
  onOrderComplete: (order: Order) => Promise<Order>;
}

const FREE_DELIVERY_THRESHOLD = 2000;

const DELIVERY_RATES: Record<DeliveryZone, number> = {
  inside_chittagong: 70,
  outside_chittagong: 120,
};

const initialAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Bangladesh",
  deliveryZone: "inside_chittagong",
};

function getDeliveryZoneLabel(deliveryZone: DeliveryZone) {
  return deliveryZone === "inside_chittagong"
    ? "Inside Chittagong"
    : "Outside Chittagong";
}

export function CheckoutPage({ cart, onOrderComplete }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [submitError, setSubmitError] = useState("");

  const shipping =
    cart.total >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_RATES[address.deliveryZone];
  const tax = 0;
  const total = cart.total + shipping;

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!address.firstName.trim()) newErrors.firstName = "First name is required";
    if (!address.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone is required";
    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);
    setSubmitError("");

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      shippingAddress: address,
      paymentMethod,
      subtotal: cart.total,
      shipping,
      tax,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      const savedOrder = await onOrderComplete(order);
      navigate("/order-confirmation", { state: { order: savedOrder } });
    } catch (error) {
      console.error("Failed to complete order:", error);
      setSubmitError(
        error instanceof Error
          ? `We couldn't save your order right now: ${error.message}`
          : "We couldn't save your order right now. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pb-16 pt-24 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-[#1A2E28]">
              Your cart is empty
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="rounded-full bg-[#2F5D50] px-6 py-3 font-medium text-white transition-colors hover:bg-[#264d43]"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#2F5D50] transition-colors hover:text-[#1A2E28]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#1A2E28]">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={address.firstName}
                      onChange={(event) =>
                        handleAddressChange("firstName", event.target.value)
                      }
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.firstName ? "border-red-300" : "border-[#D1D5DB]"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={address.lastName}
                      onChange={(event) =>
                        handleAddressChange("lastName", event.target.value)
                      }
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.lastName ? "border-red-300" : "border-[#D1D5DB]"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(event) =>
                        handleAddressChange("email", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(event) =>
                        handleAddressChange("phone", event.target.value)
                      }
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.phone ? "border-red-300" : "border-[#D1D5DB]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#334155]">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(event) =>
                      handleAddressChange("address", event.target.value)
                    }
                    placeholder="Street address"
                    className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                      errors.address ? "border-red-300" : "border-[#D1D5DB]"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(event) =>
                        handleAddressChange("city", event.target.value)
                      }
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.city ? "border-red-300" : "border-[#D1D5DB]"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#334155]">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(event) =>
                        handleAddressChange("country", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none"
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#334155]">
                    Delivery Area
                  </label>
                  <select
                    value={address.deliveryZone}
                    onChange={(event) =>
                      handleAddressChange("deliveryZone", event.target.value)
                    }
                    className="w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none"
                  >
                    <option value="inside_chittagong">
                      Inside Chittagong - BDT 70
                    </option>
                    <option value="outside_chittagong">
                      Outside Chittagong - BDT 120
                    </option>
                  </select>
                  <p className="mt-2 text-xs text-[#4a6b5f]">
                    Delivery becomes free automatically on orders of BDT 2,000 or
                    more.
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[#1A2E28]">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "cod",
                        label: "Cash On Delivery",
                        icon: CreditCard,
                      },
                      {
                        id: "bkash",
                        label: "bKash",
                        icon: () => (
                          <span className="font-bold text-pink-600">bKash</span>
                        ),
                      },
                      { id: "bank", label: "Bank Transfer", icon: Shield },
                    ].map(({ id, label, icon: Icon }) => (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                          paymentMethod === id
                            ? "border-[#2F5D50] bg-[#2F5D50]/5"
                            : "border-[#D1D5DB] hover:border-[#2F5D50]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={(event) =>
                            setPaymentMethod(event.target.value as PaymentMethod)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            paymentMethod === id
                              ? "border-[#2F5D50]"
                              : "border-[#D1D5DB]"
                          }`}
                        >
                          {paymentMethod === id && (
                            <div className="h-3 w-3 rounded-full bg-[#2F5D50]" />
                          )}
                        </div>
                        <Icon className="h-5 w-5 text-[#2F5D50]" />
                        <span className="font-medium text-[#1A2E28]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5D50] py-4 font-semibold text-white transition-all duration-200 hover:bg-[#264d43] disabled:cursor-not-allowed disabled:bg-[#A8C686]"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-[#1A2E28]">
                Order Summary
              </h3>

              <div className="mb-6 space-y-4">
                {cart.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1A2E28]">
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

              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6b5f]">Subtotal</span>
                  <span className="font-medium text-[#1A2E28]">
                    BDT {cart.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6b5f]">
                    Delivery ({getDeliveryZoneLabel(address.deliveryZone)})
                  </span>
                  <span className="font-medium text-[#1A2E28]">
                    {shipping === 0 ? "Free" : `BDT ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E7EB] pt-2 text-lg font-bold">
                  <span className="text-[#1A2E28]">Total</span>
                  <span className="text-[#2F5D50]">BDT {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#A8C686]/10 p-4">
                <div className="flex items-center gap-2 text-sm text-[#2F5D50]">
                  <Truck className="h-4 w-4" />
                  <span>Free delivery on orders of BDT 2,000 or more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
