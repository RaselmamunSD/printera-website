"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function RequestQuoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    product_name: "",
    quantity: 1,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/request-a-quote/", formData);
      setSubmitted(true);
      toast.success("Quote request submitted successfully!");
    } catch (err) {
      const data = err.response?.data;
      const msg =
        (data && Object.values(data)[0]?.[0]) ||
        "Failed to submit request. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="bg-[#F8FAFC] min-h-[600px] flex items-center justify-center py-20 px-6">
        <div className="bg-white w-full max-w-4xl p-10 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for your quote request. Our team will review it and get
            back to you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", phone: "", company_name: "", product_name: "", quantity: 1, message: "" });
            }}
            className="bg-[#EE2A24] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#d6221c] transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8FAFC] min-h-[600px] flex items-center justify-center py-20 px-6">
      <div className="bg-white w-full max-w-4xl p-10 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-10">
          Request a Quote
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 ml-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange("name")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Phone & Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 ml-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={handleChange("phone")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 ml-1">
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                placeholder="Your company (optional)"
                value={formData.company_name}
                onChange={handleChange("company_name")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Product & Quantity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="product_name" className="block text-sm font-semibold text-gray-700 ml-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="product_name"
                type="text"
                required
                placeholder="e.g. ADA Restroom Sign"
                value={formData.product_name}
                onChange={handleChange("product_name")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 ml-1">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange("quantity")}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 ml-1">
              Project Details
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Describe your signage needs, dimensions, and materials..."
              value={formData.message}
              onChange={handleChange("message")}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#EE2A24] focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#EE2A24] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#d6221c] transition-all active:scale-[0.97] shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ name: "", email: "", phone: "", company_name: "", product_name: "", quantity: 1, message: "" })}
              className="bg-white text-gray-700 px-10 py-3.5 rounded-xl font-bold border border-gray-300 hover:bg-gray-50 transition-all active:scale-[0.97]"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
