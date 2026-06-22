import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Lock,
  MapPin,
  Phone,
  ShoppingBag,
  Shield,
  Truck,
  User,
} from "lucide-react";
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

type ShippingAddressForm = Omit<ShippingAddress, "deliveryZone"> & {
  deliveryZone: DeliveryZone | "";
};

const initialAddress: ShippingAddressForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Bangladesh",
  deliveryZone: "",
};

function getDeliveryZoneLabel(deliveryZone: DeliveryZone) {
  return deliveryZone === "inside_chittagong"
    ? "Inside Chittagong"
    : "Outside Chittagong";
}

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#334155]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function CheckoutPage({ cart, onOrderComplete }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddressForm>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddressForm, string>>
  >({});
  const [submitError, setSubmitError] = useState("");

  const shipping =
    !address.deliveryZone || cart.total >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_RATES[address.deliveryZone];
  const total = cart.total + shipping;

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cart.total);
  const freeDeliveryProgress = Math.min(
    100,
    (cart.total / FREE_DELIVERY_THRESHOLD) * 100,
  );

  const inputClass = (field?: string) =>
    `w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/20 ${
      field
        ? "border-red-300 focus:border-red-400"
        : "border-[#E2E8F0] focus:border-[#2F5D50]"
    }`;

  const handleAddressChange = (
    field: keyof ShippingAddressForm,
    value: string,
  ) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddressForm, string>> = {};
    if (!address.firstName.trim()) newErrors.firstName = "Required";
    if (!address.lastName.trim()) newErrors.lastName = "Required";
    if (!address.phone.trim()) newErrors.phone = "Required";
    if (!address.address.trim()) newErrors.address = "Required";
    if (!address.city.trim()) newErrors.city = "Required";
    if (!address.deliveryZone)
      newErrors.deliveryZone = "Please select a delivery area";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!address.deliveryZone) return;

    setIsProcessing(true);
    setSubmitError("");

    const shippingAddress: ShippingAddress = {
      ...address,
      deliveryZone: address.deliveryZone,
    };

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      subtotal: cart.total,
      shipping,
      tax: 0,
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
          ? `We couldn't save your order: ${error.message}`
          : "We couldn't save your order right now. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#A8C686]/20">
            <ShoppingBag className="h-9 w-9 text-[#2F5D50]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#1A2E28]">
            Your cart is empty
          </h1>
          <p className="mb-6 text-[#4a6b5f]">
            Add some items before checking out.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="rounded-full bg-[#2F5D50] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#264d43]"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const orderSummaryContent = (
    <>
      {/* Free delivery banner */}
      <div className="mb-5 rounded-xl bg-[#FAF7F2] p-4">
        {amountToFreeDelivery === 0 ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#2F5D50]">
            <Truck className="h-4 w-4 flex-shrink-0" />
            Free delivery unlocked!
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#4a6b5f]">
                Add{" "}
                <span className="font-semibold text-[#1A2E28]">
                  BDT {amountToFreeDelivery.toFixed(0)}
                </span>{" "}
                more for free delivery
              </span>
              <Truck className="h-3.5 w-3.5 text-[#2F5D50]" />
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#2F5D50] transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Cart items */}
      <div className="space-y-3">
        {cart.items.map(({ product, quantity }) => (
          <div key={product.id} className="flex gap-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5D50] text-[10px] font-bold text-white">
                {quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#1A2E28]">
                {product.name}
              </p>
              <p className="text-xs text-[#94A3B8]">{product.unit}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-[#1A2E28]">
                BDT {(getDiscountedPrice(product) * quantity).toFixed(2)}
              </p>
              {hasDiscount(product) && (
                <p className="text-xs text-[#94A3B8] line-through">
                  BDT {(product.price * quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-[#F1F5F9]" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">
            Subtotal ({cart.count} item{cart.count !== 1 ? "s" : ""})
          </span>
          <span className="font-medium text-[#1A2E28]">
            BDT {cart.total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">Delivery</span>
          <span className="font-medium text-[#1A2E28]">
            {!address.deliveryZone
              ? "—"
              : shipping === 0
                ? "Free"
                : `BDT ${shipping.toFixed(2)}`}
          </span>
        </div>
        {address.deliveryZone && (
          <p className="text-right text-xs text-[#94A3B8]">
            {getDeliveryZoneLabel(address.deliveryZone)}
          </p>
        )}
        <div className="flex justify-between border-t border-[#F1F5F9] pt-3">
          <span className="text-base font-bold text-[#1A2E28]">Total</span>
          <span className="text-base font-bold text-[#2F5D50]">
            BDT {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-5 flex items-center justify-center gap-4 border-t border-[#F1F5F9] pt-4 text-xs text-[#94A3B8]">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3" /> Secure checkout
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3 w-3" /> Protected
        </span>
        <span className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> Fast delivery
        </span>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Page shell ── */}
      <div className="min-h-screen bg-[#FAF7F2]">

        {/* Top nav strip (sits below the site header) */}
        <div className="sticky top-16 z-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2F5D50] transition-colors hover:text-[#1A2E28]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back to cart</span>
            </button>

            <h1 className="text-base font-bold text-[#1A2E28]">Checkout</h1>

            <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>

        {/* ── Mobile: collapsible order summary ── */}
        <div className="lg:hidden border-b border-[#E2E8F0] bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 sm:px-6"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4 text-[#2F5D50]" />
              <span className="text-sm font-medium text-[#1A2E28]">
                Order summary
                <span className="ml-1.5 rounded-full bg-[#2F5D50]/10 px-2 py-0.5 text-xs font-semibold text-[#2F5D50]">
                  {cart.count}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2F5D50]">
                BDT {total.toFixed(2)}
              </span>
              {isSummaryOpen ? (
                <ChevronUp className="h-4 w-4 text-[#64748B]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#64748B]" />
              )}
            </div>
          </button>

          {isSummaryOpen && (
            <div className="border-t border-[#F1F5F9] bg-white px-4 pb-5 pt-4 sm:px-6">
              {orderSummaryContent}
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <div className="mx-auto max-w-7xl px-4 pb-36 pt-6 sm:px-6 lg:pb-16 lg:pt-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">

            {/* ═══ Left column: form sections ═══ */}
            <div className="space-y-4 sm:space-y-6">

              {submitError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-200 text-[10px] font-bold text-red-700">!</span>
                  {submitError}
                </div>
              )}

              {/* ── Section 1: Contact ── */}
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm" style={{ marginTop: '55px' }}>
                <div className="flex items-center gap-3 border-b border-[#F1F5F9] px-5 py-4 sm:px-6">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2F5D50] text-xs font-bold text-white">
                    1
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#2F5D50]" />
                    <h2 className="text-base font-semibold text-[#1A2E28]">
                      Contact Details
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="First Name *" error={errors.firstName}>
                      <input
                        type="text"
                        autoComplete="given-name"
                        value={address.firstName}
                        onChange={(e) =>
                          handleAddressChange("firstName", e.target.value)
                        }
                        placeholder="Adib"
                        className={inputClass(errors.firstName)}
                      />
                    </InputField>
                    <InputField label="Last Name *" error={errors.lastName}>
                      <input
                        type="text"
                        autoComplete="family-name"
                        value={address.lastName}
                        onChange={(e) =>
                          handleAddressChange("lastName", e.target.value)
                        }
                        placeholder="Rahman"
                        className={inputClass(errors.lastName)}
                      />
                    </InputField>
                  </div>

                  <InputField label="Email (for order updates)">
                    <input
                      type="email"
                      autoComplete="email"
                      value={address.email}
                      onChange={(e) =>
                        handleAddressChange("email", e.target.value)
                      }
                      placeholder="you@email.com"
                      className={inputClass()}
                    />
                  </InputField>

                  <InputField label="Phone *" error={errors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={address.phone}
                        onChange={(e) =>
                          handleAddressChange("phone", e.target.value)
                        }
                        placeholder="01XXXXXXXXX"
                        className={`pl-10 ${inputClass(errors.phone)}`}
                      />
                    </div>
                  </InputField>
                </div>
              </div>

              {/* ── Section 2: Delivery ── */}
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#F1F5F9] px-5 py-4 sm:px-6">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2F5D50] text-xs font-bold text-white">
                    2
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#2F5D50]" />
                    <h2 className="text-base font-semibold text-[#1A2E28]">
                      Delivery Details
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <InputField label="Street Address *" error={errors.address}>
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={address.address}
                      onChange={(e) =>
                        handleAddressChange("address", e.target.value)
                      }
                      placeholder="House / Road / Area"
                      className={inputClass(errors.address)}
                    />
                  </InputField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="City *" error={errors.city}>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        value={address.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Chittagong"
                        className={inputClass(errors.city)}
                      />
                    </InputField>
                    <InputField label="Country">
                      <select
                        value={address.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        className={inputClass()}
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
                      </select>
                    </InputField>
                  </div>

                  {/* Delivery Zone */}
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-[#334155]">
                      Delivery Area *
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          id: "inside_chittagong" as DeliveryZone,
                          label: "Inside Chittagong",
                          price: "BDT 70",
                          note: "Deliver in 1–2 days",
                        },
                        {
                          id: "outside_chittagong" as DeliveryZone,
                          label: "Outside Chittagong",
                          price: "BDT 120",
                          note: "Deliver in 2–4 days",
                        },
                      ].map(({ id, label, price, note }) => {
                        const selected = address.deliveryZone === id;
                        const hasError = Boolean(
                          errors.deliveryZone && !selected,
                        );
                        return (
                          <label
                            key={id}
                            className={`group flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all duration-150 ${
                              selected
                                ? "border-[#2F5D50] bg-[#2F5D50]/5"
                                : hasError
                                  ? "border-red-200 bg-red-50/40 hover:border-[#2F5D50]/40"
                                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2F5D50]/40 hover:bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryZone"
                              value={id}
                              checked={selected}
                              onChange={(e) =>
                                handleAddressChange(
                                  "deliveryZone",
                                  e.target.value,
                                )
                              }
                              className="sr-only"
                            />
                            {/* Custom radio */}
                            <div
                              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                selected
                                  ? "border-[#2F5D50] bg-[#2F5D50]"
                                  : hasError
                                    ? "border-red-300"
                                    : "border-[#CBD5E1]"
                              }`}
                            >
                              {selected && (
                                <Check className="h-3 w-3 text-white" strokeWidth={3} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#1A2E28]">
                                {label}
                              </p>
                              <p className="mt-0.5 text-xs text-[#64748B]">
                                {note}
                              </p>
                              <p
                                className={`mt-1.5 text-sm font-bold ${
                                  selected
                                    ? "text-[#2F5D50]"
                                    : "text-[#475569]"
                                }`}
                              >
                                {cart.total >= FREE_DELIVERY_THRESHOLD
                                  ? "Free"
                                  : price}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.deliveryZone && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.deliveryZone}
                      </p>
                    )}
                    {cart.total < FREE_DELIVERY_THRESHOLD && (
                      <p className="mt-2 text-xs text-[#64748B]">
                        Orders of BDT 2,000 or more qualify for free delivery.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Section 3: Payment ── */}
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#F1F5F9] px-5 py-4 sm:px-6">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2F5D50] text-xs font-bold text-white">
                    3
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#2F5D50]" />
                    <h2 className="text-base font-semibold text-[#1A2E28]">
                      Payment Method
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 p-5 sm:p-6">
                  {[
                    {
                      id: "cod" as PaymentMethod,
                      label: "Cash on Delivery",
                      description: "Pay in cash when your order arrives",
                      icon: Banknote,
                      iconBg: "bg-emerald-50",
                      iconColor: "text-emerald-600",
                    },
                    {
                      id: "bkash" as PaymentMethod,
                      label: "bKash",
                      description: "Pay via bKash mobile banking",
                      icon: Phone,
                      iconBg: "bg-pink-50",
                      iconColor: "text-pink-600",
                    },
                    {
                      id: "bank" as PaymentMethod,
                      label: "Bank Transfer",
                      description: "Direct transfer to our bank account",
                      icon: Shield,
                      iconBg: "bg-blue-50",
                      iconColor: "text-blue-600",
                    },
                  ].map(
                    ({ id, label, description, icon: Icon, iconBg, iconColor }) => {
                      const selected = paymentMethod === id;
                      return (
                        <label
                          key={id}
                          className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-150 ${
                            selected
                              ? "border-[#2F5D50] bg-[#2F5D50]/5"
                              : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2F5D50]/40 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={id}
                            checked={selected}
                            onChange={(e) =>
                              setPaymentMethod(e.target.value as PaymentMethod)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                          >
                            <Icon className={`h-5 w-5 ${iconColor}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#1A2E28]">
                              {label}
                            </p>
                            <p className="mt-0.5 text-xs text-[#64748B]">
                              {description}
                            </p>
                          </div>
                          <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              selected
                                ? "border-[#2F5D50] bg-[#2F5D50]"
                                : "border-[#CBD5E1]"
                            }`}
                          >
                            {selected && (
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            )}
                          </div>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Desktop submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="hidden w-full items-center justify-center gap-2.5 rounded-2xl bg-[#2F5D50] py-4 text-base font-semibold text-white shadow-md shadow-[#2F5D50]/20 transition-all duration-200 hover:bg-[#264d43] hover:shadow-lg hover:shadow-[#2F5D50]/30 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Place Order · BDT {total.toFixed(2)}
                  </>
                )}
              </button>

              <p className="hidden text-center text-xs text-[#94A3B8] lg:block">
                By placing your order you agree to our terms and conditions.
              </p>
            </div>

            {/* ═══ Right column: Order summary (desktop only) ═══ */}
            <div className="hidden lg:block">
              <div className="sticky top-36 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-base font-bold text-[#1A2E28]">
                  Order Summary
                </h2>
                {orderSummaryContent}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile sticky bottom bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E2E8F0] bg-white/95 px-4 py-4 shadow-xl backdrop-blur-sm sm:px-6 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs text-[#64748B]">
              {cart.count} item{cart.count !== 1 ? "s" : ""}
              {address.deliveryZone && (
                <span className="ml-1">
                  · {shipping === 0 ? "Free delivery" : `+ BDT ${shipping} delivery`}
                </span>
              )}
            </div>
            <div className="text-base font-bold text-[#1A2E28]">
              BDT {total.toFixed(2)}
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2F5D50] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#2F5D50]/20 transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Placing Order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
