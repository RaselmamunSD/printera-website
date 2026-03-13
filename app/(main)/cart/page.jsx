"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import axios from "@/lib/axios";
import {
  clearCart,
  fetchCart,
  getCartHeaders,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart";

const emptyShippingDetails = {
  full_name: "",
  phone: "",
  email: "",
  organization: "",
  street_address: "",
  city: "",
  state: "",
  postal_code: "",
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const FormField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  gridSpan = "col-span-2",
  type = "text",
  required = false,
}) => (
  <div className={gridSpan}>
    <label className="mb-1.5 block text-[13px] font-black uppercase tracking-tight text-[#1e1e2d]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-bold transition-colors placeholder:text-gray-300 focus:border-[#2B6BFF] focus:outline-none"
    />
  </div>
);

export default function CheckoutFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");

  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [shippingDetails, setShippingDetails] = useState(emptyShippingDetails);

  const loadCart = useCallback(async (method = deliveryMethod) => {
    try {
      setLoading(true);
      const nextCart = await fetchCart(method);
      setCart(nextCart);
    } catch (error) {
      toast.error(error.response?.data?.error || "Cart load করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    loadCart(deliveryMethod);
  }, [deliveryMethod, loadCart]);

  useEffect(() => {
    if (checkoutStatus === "success") {
      setStep(4);
      toast.success("Payment complete হয়েছে। Order confirm করা হচ্ছে।");

      if (localStorage.getItem("access_token")) {
        axios
          .get("/bookings/")
          .then((response) => {
            const latestOrder = response.data?.[0];
            if (latestOrder?.order_number) {
              setOrderNumber(latestOrder.order_number);
            }
          })
          .catch(() => { });
      }
    }

    if (checkoutStatus === "cancel") {
      setStep(3);
      toast.error("Stripe checkout cancel হয়েছে। চাইলে আবার payment করতে পারেন।");
    }
  }, [checkoutStatus]);

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingStep = () => {
    const requiredFields = ["full_name", "phone", "email"];
    const missingContact = requiredFields.find((field) => !shippingDetails[field]?.trim());

    if (missingContact) {
      toast.error("নাম, ফোন, আর email দিতে হবে।");
      return false;
    }

    if (deliveryMethod === "shipping") {
      const addressFields = ["street_address", "city", "state", "postal_code"];
      const missingAddress = addressFields.find((field) => !shippingDetails[field]?.trim());
      if (missingAddress) {
        toast.error("Shipping address complete করুন।");
        return false;
      }
    }

    return true;
  };

  const handleQuantityChange = async (itemId, nextQuantity) => {
    if (nextQuantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(itemId);
      const nextCart = await updateCartItem(itemId, { quantity: nextQuantity }, deliveryMethod);
      setCart(nextCart);
    } catch (error) {
      toast.error(error.response?.data?.error || "Quantity update করা যায়নি।");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingItemId(itemId);
      const nextCart = await removeCartItem(itemId, deliveryMethod);
      setCart(nextCart);
      toast.success("Item cart থেকে remove হয়েছে।");
    } catch (error) {
      toast.error(error.response?.data?.error || "Item remove করা যায়নি।");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const nextCart = await clearCart(deliveryMethod);
      setCart(nextCart);
      setStep(0);
      toast.success("Cart empty করা হয়েছে।");
    } catch (error) {
      toast.error(error.response?.data?.error || "Cart clear করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateShippingStep()) {
      setStep(1);
      return;
    }

    if (!localStorage.getItem("access_token")) {
      toast.error("Payment complete করতে login করতে হবে।");
      router.push("/login");
      return;
    }

    try {
      setCheckingOut(true);
      const response = await axios.post(
        "/payments/create-checkout-session/",
        {
          delivery_method: deliveryMethod,
          shipping_details: shippingDetails,
          success_url: `${window.location.origin}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart?checkout=cancel`,
        },
        {
          headers: getCartHeaders(),
        },
      );

      window.location.href = response.data.url;
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Stripe checkout শুরু করা যায়নি। পরে real Stripe key দিলে এটা live payment নেবে।",
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const summary = {
    itemCount: cart?.item_count || 0,
    subtotal: cart?.subtotal || "0.00",
    shipping: cart?.shipping_estimate || "0.00",
    tax: cart?.tax_estimate || "0.00",
    total: cart?.total_estimate || "0.00",
  };

  const ProgressBar = () => {
    const steps = [
      { id: 1, label: "Shipping" },
      { id: 2, label: "Payment" },
      { id: 3, label: "Review" },
    ];

    return (
      <div className="mb-10 flex w-fit items-center gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        {steps.map((entry, index) => {
          const isCompleted = step > entry.id;
          const isActive = step === entry.id;

          return (
            <React.Fragment key={entry.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black transition-all ${isCompleted ? "bg-[#10B981] text-white" : isActive ? "bg-[#2B6BFF] text-white" : "bg-gray-100 text-gray-400"
                    }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> : entry.id}
                </div>
                <span className={`hidden text-sm font-black lg:block ${isActive || isCompleted ? "text-[#1e1e2d]" : "text-gray-300"}`}>
                  {entry.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-[2px] w-12 ${step > entry.id ? "bg-[#10B981]" : "bg-gray-100"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const OrderSummarySidebar = () => (
    <aside className="sticky top-6 w-full lg:w-[380px]">
      <div className="border border-gray-100 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-lg font-black text-[#1e1e2d]">Order Summary</h3>
          {cart?.items?.length > 0 && step === 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-xs font-black uppercase tracking-wide text-red-500 hover:text-red-600"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="space-y-3 border-b border-gray-100 pb-5 text-sm font-bold">
          {cart?.items?.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-gray-400">
              <span>
                {item.product_name} (x{item.quantity})
              </span>
              <span className="text-[#1e1e2d]">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-4 text-sm font-bold">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-[#1e1e2d]">{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span className="text-[#1e1e2d]">{deliveryMethod === "pickup" ? "Pickup" : formatCurrency(summary.shipping)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Tax</span>
            <span className="text-[#1e1e2d]">{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xl font-black text-[#1e1e2d]">Total</span>
            <span className="text-2xl font-black text-[#2B6BFF]">{formatCurrency(summary.total)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-black text-gray-400">
            <Lock size={10} /> SSL
          </div>
          <div className="flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-[10px] font-black text-gray-400">
            <ShieldCheck size={10} /> Secure
          </div>
        </div>
      </div>
    </aside>
  );

  const renderCustomization = (customization) => {
    if (!customization) {
      return null;
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-bold text-gray-400">
        {customization.width && customization.height && (
          <p>
            Size: <span className="text-[#1e1e2d]">{customization.width}&quot; x {customization.height}&quot;</span>
          </p>
        )}
        {customization.material && (
          <p>
            Material: <span className="text-[#1e1e2d]">{customization.material}</span>
          </p>
        )}
        {customization.text && (
          <p className="col-span-2">
            Text: <span className="text-[#1e1e2d]">{customization.text}</span>
          </p>
        )}
        <p>
          Braille: <span className="text-[#1e1e2d]">{customization.braille ? "Yes" : "No"}</span>
        </p>
      </div>
    );
  };

  const ShoppingCartView = () => {
    if (loading) {
      return (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <LoaderCircle className="mx-auto mb-4 animate-spin text-[#2B6BFF]" size={28} />
          <p className="font-bold text-gray-500">Cart loading...</p>
        </div>
      );
    }

    if (!cart || cart.is_empty) {
      return (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
          <h1 className="mb-3 text-3xl font-black text-[#1e1e2d]">Your cart is empty</h1>
          <p className="mx-auto mb-8 max-w-xl text-sm font-medium text-gray-500">
            Product configure করে cart-এ add করলে এখান থেকে quantity update, checkout, আর Stripe payment করতে পারবেন।
          </p>
          <Link href="/products" className="inline-flex rounded-2xl bg-[#2B6BFF] px-6 py-4 text-sm font-black text-white hover:bg-[#1A56E0]">
            Browse Products
          </Link>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-500">
        <h1 className="mb-8 text-2xl font-black text-[#1e1e2d]">Shopping Cart</h1>
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <div className="flex-grow space-y-5">
            {cart.items.map((item) => (
              <div key={item.id} className="border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <span className="text-center text-[10px] font-black uppercase leading-tight text-gray-400">
                      {item.customization_data?.text || item.product_name}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-black text-[#1e1e2d]">{item.product_name}</h2>
                        {renderCustomization(item.customization_data)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItemId === item.id}
                        className="text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-[#1e1e2d]">Quantity:</span>
                        <div className="flex items-center rounded-lg border border-gray-200 p-1">
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updatingItemId === item.id || item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 text-sm font-black">{item.quantity}</span>
                          <button
                            type="button"
                            className="p-1 text-[#2B6BFF] hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItemId === item.id}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-400">Unit Price</p>
                        <p className="text-sm font-black text-gray-500">{formatCurrency(item.unit_price)}</p>
                        <p className="mt-2 text-xl font-black text-[#2B6BFF]">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[380px]">
            <OrderSummarySidebar />
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-5 w-full rounded-2xl bg-[#2B6BFF] py-4.5 text-lg font-black text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#1A56E0]"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/products"
              className="mt-4 block w-full rounded-2xl border-2 border-gray-100 py-4.5 text-center font-black text-[#1e1e2d] hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShippingView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-black text-[#1e1e2d]">Checkout</h1>
      <ProgressBar />
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex-grow border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h3 className="mb-6 text-md font-black text-[#1e1e2d]">Delivery Information</h3>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod("pickup")}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${deliveryMethod === "pickup" ? "border-[#2B6BFF] bg-blue-50/10" : "border-gray-100"}`}
            >
              <p className="text-sm font-black text-[#1e1e2d]">Store Pickup</p>
              <p className="mt-2 text-[10px] font-black uppercase text-green-500">Free pickup in 3-5 days</p>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod("shipping")}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${deliveryMethod === "shipping" ? "border-[#2B6BFF] bg-blue-50/10" : "border-gray-100"}`}
            >
              <p className="text-sm font-black text-[#1e1e2d]">Ship to Address</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-tight text-gray-400">$15 flat rate, free over $100</p>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-md font-black">Contact Information</h3>
            <div className="grid grid-cols-2 gap-5">
              <FormField label="Full Name" name="full_name" value={shippingDetails.full_name} onChange={handleShippingChange} placeholder="Enter full name" required />
              <FormField label="Phone" name="phone" value={shippingDetails.phone} onChange={handleShippingChange} placeholder="(555) 123-4567" gridSpan="col-span-1" required />
              <FormField label="Email" name="email" value={shippingDetails.email} onChange={handleShippingChange} placeholder="your@email.com" gridSpan="col-span-1" type="email" required />
              <FormField label="Organization / Building Name" name="organization" value={shippingDetails.organization} onChange={handleShippingChange} placeholder="e.g., City Hall, ABC Corporation" />
            </div>
          </div>

          {deliveryMethod === "shipping" && (
            <div className="mt-10 space-y-6 border-t border-gray-50 pt-10">
              <h3 className="text-md font-black">Shipping Address</h3>
              <div className="grid grid-cols-4 gap-5">
                <FormField label="Street Address" name="street_address" value={shippingDetails.street_address} onChange={handleShippingChange} placeholder="123 Street Name" gridSpan="col-span-4" required />
                <FormField label="City" name="city" value={shippingDetails.city} onChange={handleShippingChange} placeholder="City" gridSpan="col-span-2" required />
                <FormField label="State" name="state" value={shippingDetails.state} onChange={handleShippingChange} placeholder="State" gridSpan="col-span-1" required />
                <FormField label="ZIP Code" name="postal_code" value={shippingDetails.postal_code} onChange={handleShippingChange} placeholder="10001" gridSpan="col-span-1" required />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (validateShippingStep()) {
                setStep(2);
              }
            }}
            className="mt-10 w-full rounded-2xl bg-[#2B6BFF] py-4.5 text-lg font-black text-white"
          >
            Continue to Payment
          </button>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );

  const PaymentView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-black text-[#1e1e2d]">Checkout</h1>
      <ProgressBar />
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex-grow border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <h3 className="mb-8 text-md font-black text-[#1e1e2d]">Payment Information</h3>

          <div className="rounded-3xl border border-gray-100 bg-[#F8FAFC] p-8">
            <p className="mb-3 text-sm font-black uppercase tracking-wider text-[#2B6BFF]">Stripe Secure Checkout</p>
            <h4 className="mb-3 text-2xl font-black text-[#1e1e2d]">Card details Stripe page-এ collect হবে</h4>
            <p className="mb-6 text-sm font-medium leading-7 text-gray-500">
              Review step থেকে “Place Order & Pay” চাপলে আপনি Stripe hosted checkout page-এ redirect হবেন। আপনি পরে real Stripe key দিলে live payment ঠিকমতো কাজ করবে।
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <Lock size={18} className="text-gray-400" />
              <p className="text-xs font-bold text-gray-500">Card data আপনার app server-এ না এসে Stripe secure checkout-এ যাবে।</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setStep(1)} className="w-full rounded-2xl border-2 border-gray-100 py-4.5 font-black text-[#1e1e2d]">
              Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="w-full rounded-2xl bg-[#2B6BFF] py-4.5 text-lg font-black text-white">
              Review Order
            </button>
          </div>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );

  const ReviewView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="mb-8 text-2xl font-black text-[#1e1e2d]">Checkout</h1>
      <ProgressBar />

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="w-full flex-grow rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="mb-6 text-[18px] font-bold text-gray-900">Review Your Order</h3>

          <div className="mb-6">
            <h4 className="mb-3 text-[15px] font-medium text-gray-900">{deliveryMethod === "pickup" ? "Pickup Contact:" : "Shipping To:"}</h4>
            <div className="space-y-1 text-[14px] text-gray-600">
              <p>{shippingDetails.full_name}</p>
              {shippingDetails.organization && <p>{shippingDetails.organization}</p>}
              {deliveryMethod === "shipping" && (
                <>
                  <p>{shippingDetails.street_address}</p>
                  <p>
                    {shippingDetails.city}, {shippingDetails.state} {shippingDetails.postal_code}
                  </p>
                </>
              )}
              <p>{shippingDetails.phone}</p>
              <p>{shippingDetails.email}</p>
            </div>
            <button type="button" onClick={() => setStep(1)} className="mt-3 text-[13px] font-medium text-[#2B6BFF] hover:underline">
              Edit shipping info
            </button>
          </div>

          <hr className="mb-6 border-gray-200" />

          <div className="mb-6">
            <h4 className="mb-4 text-[15px] font-medium text-gray-900">Order Items:</h4>
            <div className="space-y-5">
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
                  <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-2 text-center text-[10px] font-medium uppercase tracking-wider text-gray-800">
                    {item.customization_data?.text || item.product_name}
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    <h5 className="mb-1 text-[14px] font-medium text-gray-900">{item.product_name}</h5>
                    {item.customization_data?.width && item.customization_data?.height && (
                      <p className="text-[13px] leading-relaxed text-gray-500">
                        {item.customization_data.width}&quot; × {item.customization_data.height}&quot; | {item.customization_data.material || "Custom"}
                      </p>
                    )}
                    {item.customization_data?.text && (
                      <p className="text-[13px] leading-relaxed text-gray-500">Text: &quot;{item.customization_data.text}&quot;</p>
                    )}
                    <p className="text-[13px] leading-relaxed text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#D97706]" />
              <div>
                <h5 className="mb-1 text-[14px] font-semibold text-[#92400E]">Please review your custom text carefully</h5>
                <p className="text-[13px] leading-relaxed text-[#92400E] opacity-90">
                  Production শুরু হওয়ার পরে custom text change করা যাবে না। Spell, punctuation, আর size/material সব ঠিক আছে কিনা দেখে নিন।
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setStep(2)} className="w-full rounded-lg border border-gray-300 py-3.5 text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50">
              Back
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full rounded-lg bg-[#2B6BFF] py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
            >
              {checkingOut ? "Redirecting to Stripe..." : "Place Order & Pay"}
            </button>
          </div>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex max-w-3xl flex-col items-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mb-6 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#E8F5E9] text-[#10B981]">
          <CheckCircle2 size={32} />
        </div>

        <h2 className="mb-2 text-[22px] font-bold text-[#1e1e2d]">Order Confirmed!</h2>
        <p className="mb-8 text-[15px] text-gray-500">Your order has been submitted successfully.</p>

        <div className="mb-8 flex w-full flex-col items-center rounded-xl bg-[#F8FAFC] py-8">
          <p className="mb-2 text-[13px] text-gray-500">Order Number</p>
          <p className="text-[24px] font-black text-[#1e1e2d]">{orderNumber || "Generating..."}</p>
        </div>

        <p className="mb-10 max-w-[480px] text-[15px] leading-relaxed text-gray-600">
          Confirmation email এবং payment update Stripe-এর মাধ্যমে sync হবে। Dashboard থেকে order status track করতে পারবেন।
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Link href="/dashboard/order-history" className="flex-1 rounded-lg bg-[#2B6BFF] py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-600">
            View Order Status
          </Link>
          <Link href="/products" className="flex-1 rounded-lg border border-gray-200 py-3.5 text-[15px] font-medium text-[#1e1e2d] transition-colors hover:bg-gray-50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {step === 0 && <ShoppingCartView />}
        {step === 1 && <ShippingView />}
        {step === 2 && <PaymentView />}
        {step === 3 && <ReviewView />}
        {step === 4 && <SuccessView />}
      </div>
    </main>
  );
}
