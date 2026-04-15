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
    color: product?.color_1 || "#000000",
    text: "RESTROOM",
    braille: false, // Default changed for selection
    quantity: 1,
  });

  useEffect(() => {
    if (product) {
      setConfig((prev) => ({
        ...prev,
        color: product.color_1 || "#000000",
        text: (product.name || "CUSTOM SIGN").toUpperCase(),
      }));
    }
  }, [product]);

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
      toast.error("Product information failed to load. Please try again.");
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
      toast.success("The product has been added to the cart");
    } catch (cartError) {
      toast.error(cartError.response?.data?.error || "Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const colorOptions = [
    product?.color_1,
    product?.color_2,
    product?.color_3,
    product?.color_4,
    product?.color_5,
    product?.color_6,
    product?.color_7,
    product?.color_8,
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#EE2A24] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Product...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] flex items-center justify-center text-center px-6">
        <div>
          <Info className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Something Went Wrong
          </h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <Link href="/products">
            <button className="mt-6 bg-[#EE2A24] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d6221c] transition-all">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#EE2A24] transition-colors mb-6"
        >
          <ChevronLeft size={18} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- Preview Column --- */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Live Preview
              </span>
              <button
                onClick={() =>
                  setConfig({ ...config, text: "RESTROOM", color: "#000000" })
                }
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800"
              >
                <RotateCcw size={14} />
                Reset View
              </button>
            </div>

            <div
              className="w-full max-w-md h-80 rounded-lg flex items-center justify-center transition-all"
              style={{ backgroundColor: config.color }}
            >
              <div className="text-center">
                <p
                  className="font-bold text-5xl transition-all"
                  style={{
                    color:
                      config.color === "#000000" || config.color === "#0000FF"
                        ? "white"
                        : "black",
                  }}
                >
                  {config.text}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{
                    color:
                      config.color === "#000000" || config.color === "#0000FF"
                        ? "white"
                        : "black",
                  }}
                >
                  {config.width}"×{config.height}"
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-4 mt-8 flex items-start gap-3 w-full">
              <Info size={20} className="flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-bold">ADA Contrast Compliant:</span> This
                setup meets standard ADA contrast requirements (70% minimum).
              </p>
            </div>
          </div>

          {/* --- Configuration Column --- */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-500 mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* --- Progress Bar --- */}
            <div className="my-8">
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>
                  {((currentStep - 1) / (totalSteps - 1)) * 100 > 0
                    ? Math.round(
                      ((currentStep - 1) / (totalSteps - 1)) * 100
                    )
                    : 0}
                  % Complete
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#EE2A24] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentStep - 1) / (totalSteps - 1)) * 100
                      }%`,
                  }}
                />
              </div>
            </div>

            {/* --- Step 1: Dimensions --- */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Step 1: Dimensions
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Enter the width and height for your sign.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="width"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Width (inches)
                    </label>
                    <input
                      id="width"
                      type="number"
                      value={config.width}
                      onChange={(e) =>
                        setConfig({ ...config, width: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Height (inches)
                    </label>
                    <input
                      id="height"
                      type="number"
                      value={config.height}
                      onChange={(e) =>
                        setConfig({ ...config, height: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 2: Material & Color --- */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Step 2: Material & Color
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Choose the sign's material and color.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                      Select Material
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
                          className={`px-4 py-3 rounded-lg text-sm font-semibold border-2 transition-all ${config.material === mat
                              ? "bg-[#EE2A24] text-white border-[#EE2A24]"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                            }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                      Select Color
                    </h3>
                    <div className="flex gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setConfig({ ...config, color })}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${config.color === color
                              ? "border-[#EE2A24] ring-2 ring-offset-2 ring-[#EE2A24]"
                              : "border-gray-200"
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 3: Text & Braille --- */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Step 3: Text & Braille
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Customize the sign text and add optional braille.
                </p>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="signText"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sign Text
                    </label>
                    <input
                      id="signText"
                      type="text"
                      value={config.text}
                      onChange={(e) =>
                        setConfig({ ...config, text: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                      Braille Option
                    </h3>
                    <button
                      onClick={() =>
                        setConfig({ ...config, braille: !config.braille })
                      }
                      className={`w-full px-4 py-3 rounded-lg text-sm font-semibold border-2 transition-all flex justify-between items-center ${config.braille
                          ? "bg-[#EE2A24] text-white border-[#EE2A24]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <span>Add Braille (+${braillePrice.toFixed(2)})</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${config.braille ? "bg-white" : "bg-transparent"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 4: Quantity --- */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Step 4: Quantity
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  How many signs do you need?
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        quantity: Math.max(1, config.quantity - 1),
                      })
                    }
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={config.quantity}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-20 text-center text-lg font-bold px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                  />
                  <button
                    onClick={() =>
                      setConfig({ ...config, quantity: config.quantity + 1 })
                    }
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* --- Step 5: Review & Add to Cart --- */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  Step 5: Review & Add to Cart
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Review your selections before adding to the cart.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-semibold text-gray-800">
                      {config.width}" × {config.height}"
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-semibold text-gray-800">
                      {config.material}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="font-semibold text-gray-800">
                        {config.color}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Text:</span>
                    <span className="font-semibold text-gray-800">
                      {config.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Braille:</span>
                    <span className="font-semibold text-gray-800">
                      {config.braille ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold text-gray-800">
                      {config.quantity}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* --- Pricing & Navigation --- */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-4xl font-extrabold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Unit Price</p>
                  <p className="text-lg font-bold text-gray-700">
                    ${unitPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-1/3 bg-white text-gray-700 px-6 py-4 rounded-xl font-bold border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                {currentStep < totalSteps ? (
                  <button
                    onClick={nextStep}
                    className="w-2/3 bg-[#EE2A24] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#d6221c] transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-2/3 bg-[#EE2A24] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#d6221c] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
