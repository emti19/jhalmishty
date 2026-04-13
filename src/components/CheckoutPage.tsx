import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { Cart, ShippingAddress, Order } from '../types';

interface CheckoutPageProps {
  cart: Cart;
  onOrderComplete: (order: Order) => void;
}

const initialAddress: ShippingAddress = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Bangladesh',
};

export function CheckoutPage({ cart, onOrderComplete }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const shipping = cart.total >= 50 ? 0 : 5.99;
  const tax = cart.total * 0.05; // 5% tax
  const total = cart.total + shipping + tax;

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone is required';
    if (!address.address.trim()) newErrors.address = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      shippingAddress: address,
      paymentMethod,
      subtotal: cart.total,
      shipping,
      tax,
      total,
      status: 'confirmed',
      createdAt: new Date(),
    };

    onOrderComplete(order);
    setIsProcessing(false);
    navigate('/order-confirmation', { state: { order } });
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1A2E28] mb-4">Your cart is empty</h1>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#2F5D50] hover:bg-[#264d43] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#2F5D50] hover:text-[#1A2E28] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Shipping & Payment Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2E28] mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={address.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.firstName ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={address.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.lastName ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.email ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.phone ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    placeholder="Street address"
                    className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                      errors.address ? 'border-red-300' : 'border-[#D1D5DB]'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.city ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.state ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className={`w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none ${
                        errors.zipCode ? 'border-red-300' : 'border-[#D1D5DB]'
                      }`}
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm focus:border-[#2F5D50] focus:outline-none"
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="India">India</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1A2E28] mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: () => <span className="text-blue-600 font-bold">P</span> },
                      { id: 'bank', label: 'Bank Transfer', icon: Shield },
                    ].map(({ id, label, icon: Icon }) => (
                      <label
                        key={id}
                        className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                          paymentMethod === id
                            ? 'border-[#2F5D50] bg-[#2F5D50]/5'
                            : 'border-[#D1D5DB] hover:border-[#2F5D50]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === id ? 'border-[#2F5D50]' : 'border-[#D1D5DB]'
                        }`}>
                          {paymentMethod === id && <div className="w-3 h-3 bg-[#2F5D50] rounded-full" />}
                        </div>
                        <Icon className="w-5 h-5 text-[#2F5D50]" />
                        <span className="font-medium text-[#1A2E28]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#2F5D50] hover:bg-[#264d43] disabled:bg-[#A8C686] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#1A2E28] mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cart.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A2E28] truncate">{product.name}</p>
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

              <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6b5f]">Subtotal</span>
                  <span className="font-medium text-[#1A2E28]">৳{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6b5f]">Shipping</span>
                  <span className="font-medium text-[#1A2E28]">
                    {shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6b5f]">Tax</span>
                  <span className="font-medium text-[#1A2E28]">৳{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E5E7EB]">
                  <span className="text-[#1A2E28]">Total</span>
                  <span className="text-[#2F5D50]">৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#A8C686]/10 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-[#2F5D50]">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery on orders over ৳50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}