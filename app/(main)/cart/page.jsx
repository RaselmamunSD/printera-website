"use client";
import React, { useState } from "react";
import {
  Lock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

/**
 * Reusable Form Field matching the input style of the mockups
 */
const FormField = ({
  label,
  placeholder,
  gridSpan = "col-span-2",
  type = "text",
  required = false,
}) => (
  <div className={gridSpan}>
    <label className="block text-[13px] font-black text-[#1e1e2d] mb-1.5 uppercase tracking-tight">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-[#2B6BFF] transition-colors placeholder:text-gray-300 bg-white"
    />
  </div>
);

export default function CheckoutFlow() {
  // step 0: Shopping Cart, 1: Shipping, 2: Payment, 3: Review, 4: Success
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");

  // Pricing Logic
  const subtotal = 53.0;
  const shippingFee = 15.0;
  const tax = 4.24;
  const total = subtotal + shippingFee + tax;

  /**
   * PROGRESS BAR: Visible only from step 1 onwards
   */
  const ProgressBar = () => {
    const steps = [
      { id: 1, label: "Shipping" },
      { id: 2, label: "Payment" },
      { id: 3, label: "Review" },
    ];

    return (
      <div className="flex items-center gap-6 mb-10 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {steps.map((s, i) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;

          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    isCompleted ? "bg-[#10B981] text-white"
                    : isActive ? "bg-[#2B6BFF] text-white"
                    : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ?
                    <CheckCircle2 size={16} strokeWidth={3} />
                  : s.id}
                </div>
                <span
                  className={`font-black text-sm hidden lg:block ${isActive || isCompleted ? "text-[#1e1e2d]" : "text-gray-300"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-[2px] ${step > steps[i].id ? "bg-[#10B981]" : "bg-gray-100"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  /**
   * VIEW 0: SHOPPING CART (Entry Point)
   */
  const ShoppingCartView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-[#1e1e2d] mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Product Preview */}
            <div className="w-32 h-32 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-4 relative">
              <span className="text-[10px] font-black leading-tight text-gray-400 uppercase text-center">
                Restroom
              </span>
              <div className="absolute bottom-2 right-2 bg-black text-white text-[8px] px-1.5 py-0.5 rounded font-black">
                8"x6"
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-black text-[#1e1e2d]">
                  ADA Restroom Sign
                </h2>
                <button className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-3 text-sm font-bold text-gray-400">
                <p>
                  Size: <span className="text-[#1e1e2d]">8" x 6"</span>
                </p>
                <p>
                  Material: <span className="text-[#1e1e2d]">Acrylic</span>
                </p>
                <p>
                  Text: <span className="text-[#1e1e2d]">"RESTROOM"</span>
                </p>
                <p>
                  Font: <span className="text-[#1e1e2d]">Arial</span>
                </p>
                <p>
                  Braille: <span className="text-[#1e1e2d]">Yes</span>
                </p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-[#1e1e2d]">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-lg p-1">
                    <button className="p-1 hover:bg-gray-50">
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-black text-sm">1</span>
                    <button className="p-1 hover:bg-gray-50 text-[#2B6BFF]">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <span className="text-xl font-black text-[#2B6BFF]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary Sidebar */}
        <aside className="w-full lg:w-[380px]">
          <div className="bg-white border border-gray-100 p-10 shadow-sm">
            <h3 className="text-lg font-black text-[#1e1e2d] mb-8">
              Order Summary
            </h3>
            <div className="space-y-4 font-bold text-sm mb-8">
              <div className="flex justify-between text-gray-400">
                <span>ADA Restroom Sign (×1)</span>
                <span className="text-[#1e1e2d]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-gray-100 my-4" />
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-[#1e1e2d]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-gray-400 italic">
                  Calculated at checkout
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-black text-[#1e1e2d]">Total</span>
                <span className="text-2xl font-black text-[#2B6BFF]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-[#2B6BFF] text-white py-4.5 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-[#1A56E0] transition-all mb-4"
            >
              Proceed to Checkout
            </button>
            <button className="w-full bg-white border-2 border-gray-100 text-[#1e1e2d] py-4.5 rounded-2xl font-black hover:bg-gray-50 transition-colors">
              Continue Shopping
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">
                <Lock size={10} /> SSL
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">
                <ShieldCheck size={10} /> Secure
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">
                ✓ Verified
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  /**
   * SHARED SIDEBAR SUMMARY (Steps 1-3)
   */
  const OrderSummarySidebar = () => (
    <aside className="w-full lg:w-[380px] sticky top-6">
      <div className="bg-white border border-gray-100 p-10 shadow-sm">
        <h3 className="text-lg font-black text-[#1e1e2d] mb-8">
          Order Summary
        </h3>
        <div className="space-y-4 font-bold text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-[#1e1e2d]">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span className="text-[#1e1e2d]">${shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Tax (8%)</span>
            <span className="text-[#1e1e2d] text-right">${tax.toFixed(2)}</span>
          </div>
          <div className="h-[1px] bg-gray-100 my-4" />
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-[#1e1e2d]">Total</span>
            <span className="text-3xl font-black text-[#2B6BFF] text-right">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
            Estimated Delivery
          </p>
          <p className="text-md font-black text-[#1e1e2d]">3-5 Business Days</p>
        </div>
      </div>
    </aside>
  );

  /**
   * STEP 1: SHIPPING
   */
  const ShippingView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-[#1e1e2d] mb-8">Checkout</h1>
      <ProgressBar />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
          <h3 className="text-md font-black text-[#1e1e2d] mb-6">
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setDeliveryMethod("pickup")}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${deliveryMethod === "pickup" ? "border-[#2B6BFF] bg-blue-50/10" : "border-gray-100"}`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${deliveryMethod === "pickup" ? "border-[#2B6BFF]" : "border-gray-300"}`}
              >
                {deliveryMethod === "pickup" && (
                  <div className="w-2.5 h-2.5 bg-[#2B6BFF] rounded-full" />
                )}
              </div>
              <div>
                <p className="font-black text-[#1e1e2d] text-sm">
                  Store Pickup
                </p>
                <p className="text-[10px] text-green-500 font-black mt-2 uppercase">
                  ✓ FREE - Available in 3-5 days
                </p>
              </div>
            </button>
            <button
              onClick={() => setDeliveryMethod("shipping")}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${deliveryMethod === "shipping" ? "border-[#2B6BFF] bg-blue-50/10" : "border-gray-100"}`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${deliveryMethod === "shipping" ? "border-[#2B6BFF]" : "border-gray-300"}`}
              >
                {deliveryMethod === "shipping" && (
                  <div className="w-2.5 h-2.5 bg-[#2B6BFF] rounded-full" />
                )}
              </div>
              <div>
                <p className="font-black text-[#1e1e2d] text-sm">
                  Ship to Address
                </p>
                <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-tight">
                  $15.00 flat rate (FREE over $100)
                </p>
              </div>
            </button>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-md font-black">Contact Information</h3>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              <FormField
                label="Phone"
                placeholder="(555) 123-4567"
                gridSpan="col-span-1"
                required
              />
              <FormField
                label="Email"
                placeholder="your@email.com"
                gridSpan="col-span-1"
                required
              />
              <FormField
                label="Organization / Building Name"
                placeholder="e.g., City Hall, ABC Corporation"
              />
            </div>
          </div>

          {deliveryMethod === "shipping" && (
            <div className="space-y-6 pt-10 mt-10 border-t border-gray-50">
              <h3 className="text-md font-black">Shipping Address</h3>
              <div className="grid grid-cols-4 gap-5">
                <FormField
                  label="Street Address"
                  placeholder="123 Street Name"
                  gridSpan="col-span-4"
                  required
                />
                <FormField
                  label="City"
                  placeholder="City"
                  gridSpan="col-span-2"
                  required
                />
                <FormField
                  label="State"
                  placeholder="State"
                  gridSpan="col-span-1"
                  required
                />
                <FormField
                  label="ZIP Code"
                  placeholder="10001"
                  gridSpan="col-span-1"
                  required
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#2B6BFF] text-white py-4.5 rounded-2xl font-black text-lg mt-10"
          >
            Continue to Payment
          </button>
        </div>
        <OrderSummarySidebar />
      </div>
    </div>
  );

  /**
   * STEP 2: PAYMENT
   */
  const PaymentView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-[#1e1e2d] mb-8">Checkout</h1>
      <ProgressBar />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
          <h3 className="text-md font-black text-[#1e1e2d] mb-8">
            Payment Information
          </h3>
          <div className="space-y-6">
            <FormField
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className="grid grid-cols-2 gap-5">
              <FormField
                label="Expiry Date"
                placeholder="MM / YY"
                gridSpan="col-span-1"
                required
              />
              <FormField
                label="CVV"
                placeholder="123"
                gridSpan="col-span-1"
                required
              />
            </div>
            <FormField label="Billing ZIP Code" placeholder="10001" required />
            <div className="bg-[#F1F5F9] rounded-xl p-4 flex items-center gap-3 mt-4">
              <Lock size={16} className="text-gray-400" />
              <p className="text-xs font-bold text-gray-500">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <button
              onClick={() => setStep(1)}
              className="w-full border-2 border-gray-100 py-4.5 rounded-2xl font-black text-[#1e1e2d]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-[#2B6BFF] text-white py-4.5 rounded-2xl font-black text-lg"
            >
              Review Order
            </button>
          </div>
        </div>
        <OrderSummarySidebar />
      </div>
    </div>
  );

  /**
   * STEP 3: REVIEW
   */
  const ReviewView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <ProgressBar />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow w-full bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h3 className="text-[18px] font-bold text-gray-900 mb-6">
            Review Your Order
          </h3>

          {/* Shipping Info Section */}
          <div className="mb-6">
            <h4 className="text-[15px] font-medium text-gray-900 mb-3">
              Shipping To:
            </h4>
            <div className="text-[14px] text-gray-600 space-y-1">
              <p>Sohanur Rohman</p>
              <p>Apt 4B</p>
              <p>123 Maple Street</p>
              <p>New York, NY 10001</p>
              <p>+1 212-555-0198</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-[#2B6BFF] text-[13px] font-medium mt-3 hover:underline"
            >
              Edit shipping info
            </button>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Order Items Section */}
          <div className="mb-6">
            <h4 className="text-[15px] font-medium text-gray-900 mb-4">
              Order Items:
            </h4>
            <div className="flex items-start gap-4 mb-6">
              {/* Product Image Placeholder */}
              <div className="w-[88px] h-[88px] border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-gray-800 tracking-wider uppercase">
                  RESTROOM
                </span>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-center py-1">
                <h5 className="text-[14px] font-medium text-gray-900 mb-1">
                  ADA Restroom Sign
                </h5>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  8" × 6" | Acrylic
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Text: "RESTROOM"
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Qty: 1
                </p>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex gap-3">
              <AlertTriangle
                size={18}
                className="text-[#D97706] shrink-0 mt-0.5"
              />
              <div>
                <h5 className="text-[#92400E] text-[14px] font-semibold mb-1">
                  Please review your custom text carefully
                </h5>
                <p className="text-[#92400E] text-[13px] leading-relaxed opacity-90">
                  Once production begins, we cannot make changes to your custom
                  text. Please verify all spelling, punctuation, and details are
                  correct.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStep(2)}
              className="w-full border border-gray-300 py-3.5 rounded-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors text-[15px]"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="w-full bg-[#2B6BFF] text-white py-3.5 rounded-lg font-medium hover:bg-blue-600 transition-colors text-[15px]"
            >
              Place Order
            </button>
          </div>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );
  /**
   * STEP 4: SUCCESS
   */
  /**
   * STEP 4: SUCCESS
   */
  const SuccessView = () => (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-[#1e1e2d] mb-8">Checkout</h1>
      <ProgressBar />

      <div className="max-w-3xl bg-white border border-gray-100 p-8 md:p-12 shadow-sm rounded-xl flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-[64px] h-[64px] bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#10B981] mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 className="text-[22px] font-bold text-[#1e1e2d] mb-2">
          Order Confirmed!
        </h2>
        <p className="text-[15px] text-gray-500 mb-8">
          Your order has been successfully placed
        </p>

        {/* Order Number Box */}
        <div className="w-full bg-[#F8FAFC] rounded-xl py-8 mb-8 flex flex-col items-center">
          <p className="text-[13px] text-gray-500 mb-2">Order Number</p>
          <p className="text-[24px] font-black text-[#1e1e2d]">SC56378041</p>
        </div>

        {/* Instruction Text */}
        <p className="text-[15px] text-gray-600 max-w-[480px] leading-relaxed mb-10">
          We've sent a confirmation email to your inbox. You can track your
          order status in your dashboard.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Link
            href={"/order-dashboard"}
            className="flex-1 bg-[#2B6BFF] text-white py-3.5 rounded-lg font-medium hover:bg-blue-600 transition-colors text-[15px]"
          >
            View Order Status
          </Link>
          <button
            onClick={() => setStep(0)}
            className="flex-1 bg-white border border-gray-200 text-[#1e1e2d] py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-[15px]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {step === 0 && <ShoppingCartView />}
        {step === 1 && <ShippingView />}
        {step === 2 && <PaymentView />}
        {step === 3 && <ReviewView />}
        {step === 4 && <SuccessView />}
      </div>
    </main>
  );
}
