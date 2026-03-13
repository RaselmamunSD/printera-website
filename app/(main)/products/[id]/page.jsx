"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Info,
  RotateCcw,
  Plus,
  Minus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import { addCartItem } from "@/lib/cart";

export default function SignageConfigurator() {
  const params = useParams();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    width: 8,
    height: 6,
    material: "Acrylic",
    color: "#000000",
    text: "RESTROOM",
    braille: false, // Default changed for selection
    quantity: 1,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Invalid product id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`/products/${productId}/`);
        const productData = response.data;
        setProduct(productData);
        setConfig((prev) => ({
          ...prev,
          text: (productData.name || "CUSTOM SIGN").toUpperCase(),
        }));
      } catch {
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Steps updated to 5
  const totalSteps = 5;
  const basePrice = Number(product?.price || 53.0);
  const braillePrice = config.braille ? 8.0 : 0;
  const unitPrice = basePrice + braillePrice;
  const totalPrice = unitPrice * config.quantity;

  const handleAddToCart = async () => {
    if (!product?.id) {
      toast.error("Product তথ্য লোড হয়নি। আবার চেষ্টা করুন।");
      return;
    }

    try {
      setAddingToCart(true);
      await addCartItem({
        product_id: product.id,
        quantity: config.quantity,
        customization_data: {
          width: Number(config.width),
          height: Number(config.height),
          material: config.material,
          color: config.color,
          text: config.text,
          braille: config.braille,
        },
      });
      toast.success("Product cart-এ add হয়েছে।");
    } catch (cartError) {
      toast.error(cartError.response?.data?.error || "Cart-এ add করা যায়নি।");
    } finally {
      setAddingToCart(false);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-52 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-7" />
            <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200 lg:col-span-5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#EE2A24] px-5 py-3 text-sm font-bold text-white hover:bg-[#d6221c]"
          >
            <ChevronLeft size={14} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-sm">
        <Link
          href={`/products`}
          className="text-[#EB221E] hover:text-gray-900 font-semibold flex items-center transition-colors"
        >
          <ChevronLeft size={16} /> Back to Products
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: LIVE PREVIEW */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px] shadow-sm relative overflow-hidden">
            <div className="absolute top-6 left-8">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                Live Preview
              </span>
            </div>

            <div
              className="relative shadow-2xl transition-all duration-500 flex flex-col items-center justify-center p-8 border-[1px] border-gray-200"
              style={{
                backgroundColor: config.color,
                width: `${Math.min(config.width * 40, 400)}px`,
                height: `${Math.min(config.height * 40, 300)}px`,
                color: "#ffffff",
                borderRadius: "4px",
              }}
            >
              <h2 className="text-4xl font-bold tracking-widest text-center uppercase">
                {config.text || "YOUR TEXT"}
              </h2>
              {config.braille && (
                <div className="absolute bottom-10 flex gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white opacity-40"
                    />
                  ))}
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                {config.width}&quot; × {config.height}&quot;
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={() =>
                  setConfig({
                    ...config,
                    width: 8,
                    height: 6,
                    text: "RESTROOM",
                    color: "#000000",
                    braille: false,
                  })
                }
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
              >
                <RotateCcw size={14} /> Reset View
              </button>
            </div>
          </div>

          <div className="bg-[#E7F0FF] border border-[#C5DCFF] rounded-xl p-4 flex gap-3 items-start">
            <Info className="text-[#2B6BFF] shrink-0" size={18} />
            <p className="text-[13px] text-[#1E3A8A] leading-relaxed font-medium">
              <b>ADA Contrast Compliant:</b> This setup meets standard ADA
              contrast requirements (70% minimum).
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION STEPS */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="p-8 border-b border-gray-100">
              <h1 className="text-2xl font-black text-[#1e1e2d] mb-1">
                {product?.name || "Custom Product"}
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                {product?.description || "Configure your custom product"}
              </p>

              <div className="flex gap-2">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${currentStep - 1 >= i ? "bg-[#EE2A24]" : "bg-gray-100"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 flex-grow space-y-8 overflow-y-auto max-h-[600px]">
              {/* Step 1: Dimensions */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#EE2A24]">
                    Step 1: Dimensions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase">
                        Width (in)
                      </label>
                      <input
                        type="number"
                        value={config.width}
                        onChange={(e) =>
                          setConfig({ ...config, width: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2B6BFF] font-bold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase">
                        Height (in)
                      </label>
                      <input
                        type="number"
                        value={config.height}
                        onChange={(e) =>
                          setConfig({ ...config, height: e.target.value })
                        }
                        className="border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2B6BFF] font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Material & Color */}

              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#EE2A24]">
                    Step 2: Material & Color
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Acrylic",
                      "Metal",
                      "Brushed Aluminum",
                      "Stainless Steel",
                    ].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setConfig({ ...config, material: mat })}
                        className={`p-3 text-sm font-bold border rounded-lg transition-all ${config.material === mat ?
                          "border-[#EE2A24] bg-red-50 text-[#EE2A24]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">
                      Select Color
                    </label>

                    <div className="flex gap-3">
                      {["#000000", "#1E3A8A", "#10B981", "#6B7280"].map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() => setConfig({ ...config, color })}
                            style={{ backgroundColor: color }}
                            className={`w-10 h-10 rounded-lg border-2 transition-transform active:scale-90 ${config.color === color ?
                              "border-[#EE2A24] ring-2 ring-red-100"
                              : "border-white shadow-sm"
                              }`}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Text */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#EE2A24]">
                    Step 3: Text Content
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase">
                      Display Text
                    </label>
                    <input
                      type="text"
                      value={config.text}
                      onChange={(e) =>
                        setConfig({ ...config, text: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg p-3 font-bold text-gray-700 outline-none focus:border-[#2B6BFF]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Quantity */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#EE2A24]">
                    Step 4: Quantity
                  </h3>
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">Quantity</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        Units to order
                      </span>
                    </div>
                    <div className="flex items-center border-2 border-gray-200 bg-white rounded-xl overflow-hidden">
                      <button
                        className="px-4 py-2 hover:bg-gray-50"
                        onClick={() =>
                          setConfig({
                            ...config,
                            quantity: Math.max(1, config.quantity - 1),
                          })
                        }
                      >
                        <Minus size={16} className="text-gray-400" />
                      </button>
                      <span className="px-6 font-black">{config.quantity}</span>
                      <button
                        className="px-4 py-2 hover:bg-gray-50"
                        onClick={() =>
                          setConfig({
                            ...config,
                            quantity: config.quantity + 1,
                          })
                        }
                      >
                        <Plus size={16} className="text-[#2B6BFF]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NEW Step 5: Braille */}
              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#EE2A24] flex items-center gap-2">
                    <Eye size={14} /> Step 5: Braille
                  </h3>

                  <div
                    onClick={() =>
                      setConfig({ ...config, braille: !config.braille })
                    }
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${config.braille ?
                      "border-[#EE2A24] bg-red-50/30"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        Add Braille
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        Required for ADA compliance (+$8.00)
                      </span>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${config.braille ? "bg-[#EE2A24]" : "bg-gray-300"}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ${config.braille ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
                    <Info className="text-amber-600 shrink-0" size={18} />
                    <p className="text-[12px] text-amber-800 leading-relaxed">
                      Tactile braille characters are usually required for
                      permanent room identification signs in public buildings.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-8 border-t border-gray-100 bg-[#F9FAFB] rounded-b-2xl">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Total Price
                  </p>
                  <p className="text-4xl font-black text-[#1e1e2d] tracking-tighter">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Unit Price
                  </p>
                  <p className="text-sm font-bold text-gray-500">
                    ${unitPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-8 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-400 hover:bg-white hover:text-gray-900 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={currentStep === totalSteps ? handleAddToCart : nextStep}
                  disabled={addingToCart}
                  className="flex-1 bg-[#EE2A24] text-white py-4 rounded-xl font-bold shadow-xl shadow-red-100 hover:bg-[#d6221c] transition-all active:scale-[0.98]"
                >
                  {currentStep === totalSteps ? (addingToCart ? "Adding..." : "Add to Cart") : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
