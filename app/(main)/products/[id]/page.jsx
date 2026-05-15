"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Info,
  RotateCcw,
  Plus,
  Minus,
  Eye,
  Ruler,
  Palette,
  Type,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import { addCartItem } from "@/lib/cart";

const DEFAULT_SIGNS = [
  {
    id: "ada_1",
    name: "Restroom Sign",
    url: "https://images.unsplash.com/photo-1542157451-bfeec3ed3925?w=400&q=80&fit=crop",
  },
  {
    id: "ada_2",
    name: "Exit Sign",
    url: "https://images.unsplash.com/photo-1519782502660-f1db1230eeb8?w=400&q=80&fit=crop",
  },
  {
    id: "ada_3",
    name: "No Smoking",
    url: "https://images.unsplash.com/photo-1596638069502-0e9bba46c59d?w=400&q=80&fit=crop",
  },
  {
    id: "ada_4",
    name: "Stairs",
    url: "https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=400&q=80&fit=crop",
  },
  {
    id: "ada_5",
    name: "Conference Room",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&fit=crop",
  },
  {
    id: "ada_6",
    name: "Women Restroom",
    url: "https://images.unsplash.com/photo-1518174151325-103310f81d11?w=400&q=80&fit=crop",
  },
  {
    id: "ada_7",
    name: "Men Restroom",
    url: "https://images.unsplash.com/photo-1577906917637-25e0766ef92d?w=400&q=80&fit=crop",
  },
  {
    id: "ada_8",
    name: "Warning Sign",
    url: "https://images.unsplash.com/photo-1586016413725-726487e594b2?w=400&q=80&fit=crop",
  },
];

export default function SignageConfigurator() {
  const params = useParams();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [customDesign, setCustomDesign] = useState(null);

  const [isFontColorModalOpen, setIsFontColorModalOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    width: 8,
    height: 6,
    material: "Acrylic",
    color: product?.background_colors?.[0] || "",
    text: "RESTROOM",
    font: "Helvetica (ADA Compliant)",
    fontColor: product?.font_colors?.[0] || "#ffffff",
    braille: false,
    quantity: 1,
    note: "",
  });

  const isAdaSign =
    product?.name?.toLowerCase().includes("ada") ||
    product?.category?.toLowerCase().includes("ada") ||
    false;

  useEffect(() => {
    if (product) {
      setConfig((prev) => ({
        ...prev,
        color: product.background_colors?.[0] || "",
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
  const pricePerSquareInch = 1.3;
  const width = Math.max(0, Number(config.width) || 0);
  const height = Math.max(0, Number(config.height) || 0);
  const area = width * height;
  const basePrice = area * pricePerSquareInch;
  const braillePrice = config.braille ? 8.0 : 0;
  const unitPrice = basePrice + braillePrice;
  const totalPrice = unitPrice * config.quantity;
  const previewTextColor = config.fontColor || ((config.color === "#000000" || config.color === "#0000FF") ? "white" : "black");

  const handleAddToCart = async () => {
    if (!product?.id) {
      toast.error("Product information failed to load. Please try again.");
      return;
    }

    try {
      setAddingToCart(true);
      const formData = new FormData();
      formData.append("product_id", product.id);
      formData.append("quantity", config.quantity);
      formData.append("customization_data", JSON.stringify({
        width: Number(config.width),
        height: Number(config.height),
        material: config.material,
        color: config.color,
        text: config.text,
        font: config.font,
        fontColor: config.fontColor,
        braille: config.braille,
        note: config.note,
      }));
      
      if (customDesign && customDesign instanceof File) {
        formData.append("custom_design_file", customDesign);
      }

      await addCartItem(formData);
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
    ...(product?.background_colors || [])
  ].filter(Boolean);
  
  // Remove duplicates from all colors
  const uniqueColorOptions = [...new Set(colorOptions)];
  
  // Pick the first 7 colors for the quick selector outside modal
  const defaultQuickColors = uniqueColorOptions.slice(0, 7);

  const fontColorOptions = [
    ...(product?.font_colors || [])
  ].filter(Boolean);

  const uniqueFontColorOptions = [...new Set(fontColorOptions)];
  const defaultQuickFontColors = uniqueFontColorOptions.slice(0, 7);

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
                  setConfig({ ...config, text: "RESTROOM", color: product?.background_colors?.[0] || "" })
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
                    color: previewTextColor,
                    fontFamily: config.font,
                  }}
                >
                  {config.text}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{
                    color: previewTextColor,
                    fontFamily: config.font,
                  }}
                >
                  {config.width}&quot;×{config.height}&quot;
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-4 mt-8 flex items-start gap-3 w-full">
              <Info size={20} className="shrink-0 mt-0.5" />
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
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-3">
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
                <span>
                  {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%
                  Complete
                </span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      idx < currentStep ? "bg-[#EE2A24]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* --- Step 1: Dimensions --- */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler size={18} className="text-[#EE2A24]" />
                  <h2 className="text-lg font-bold text-[#EE2A24]">
                    Step 1: Dimensions
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Enter the width and height for your sign.
                </p>
                <div className="flex flex-col gap-4">
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
                <div className="flex items-center gap-2 mb-6">
                  <Palette size={18} className="text-[#EE2A24]" />
                  <h2 className="text-lg font-bold text-[#EE2A24]">
                    Step 2: Material & Color
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Material
                    </h3>
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg border-2 border-[#EE2A24] bg-blue-50/30 transition-all font-medium text-gray-800"
                      onClick={() => {}}
                    >
                      <div className="text-sm">
                        {config.material || "Acrylic"}
                      </div>
                      <div className="text-xs text-gray-500 font-normal">
                        Glossy finish
                      </div>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Background Color
                    </h3>
                    <div className="flex gap-2 flex-wrap items-center">
                      {defaultQuickColors.map((clr, idx) => (
                        <button
                          key={idx}
                          onClick={() => setConfig({ ...config, color: clr })}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${config.color === clr ? "border-[#EE2A24]" : "border-gray-200"}`}
                          style={{ backgroundColor: clr }}
                        />
                      ))}
                      {/* Plus icon to open color modal */}
                      <button
                        onClick={() => setIsColorModalOpen(true)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all bg-white"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {isColorModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
                      <button
                        onClick={() => setIsColorModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                      >
                        <X size={18} />
                      </button>
                      <h3 className="font-bold text-gray-900 mb-6">
                        Background Color
                      </h3>
                      <div className="grid grid-cols-8 gap-3 max-h-80 overflow-y-auto p-1">
                        {uniqueColorOptions.map((clr, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setConfig({ ...config, color: clr });
                              setIsColorModalOpen(false);
                            }}
                            className={`w-10 h-10 rounded-lg shadow-sm border-2 transition-all ${config.color === clr ? "border-[#EE2A24]" : "border-gray-200 hover:border-gray-400"}`}
                            style={{ backgroundColor: clr }}
                          />
                        ))}
                      </div>
                      <div className="mt-8 flex gap-4">
                        <button
                          onClick={() => setIsColorModalOpen(false)}
                          className="w-1/2 py-3 border border-gray-300 rounded-xl font-bold bg-white hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setIsColorModalOpen(false)}
                          className="w-1/2 py-3 bg-[#EE2A24] text-white rounded-xl font-bold hover:bg-[#d6221c]"
                        >
                          Continue to Text
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Step 3: Text & Braille --- */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Type size={18} className="text-[#EE2A24]" />
                  <h2 className="text-lg font-bold text-[#EE2A24]">
                    Step 3: Text Content
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="signText"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Text (e.g., Room Number, Name)
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
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Upload Custom Design (Optional)
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload your logo or custom artwork (PNG, JPG, SVG, PDF -
                      Max 5MB)
                    </p>
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 block w-full relative">
                      <input
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.svg,.pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setCustomDesign(file);
                            console.log("Selected system file:", file);
                          }
                        }}
                      />
                      <Upload
                        size={28}
                        className={
                          customDesign
                            ? "text-[#EE2A24] mb-4 hidden"
                            : "text-gray-400 mb-4"
                        }
                      />
                      {customDesign ? (
                        <div className="w-full h-32 relative flex justify-center mb-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              customDesign instanceof File
                                ? URL.createObjectURL(customDesign)
                                : customDesign.url
                            }
                            alt="Custom Design Preview"
                            className="h-full object-contain rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      ) : null}
                      <span className="font-semibold text-gray-700 mb-1">
                        {customDesign instanceof File
                          ? customDesign.name
                          : customDesign?.name
                            ? `Selected: ${customDesign.name}`
                            : "Click to upload design"}
                      </span>
                      {!customDesign && (
                        <span className="text-xs text-gray-500">
                          PNG, JPG, SVG or PDF
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="text-center text-gray-500 text-sm py-2">
                    Or
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => setIsDesignModalOpen(true)}
                      className="text-[#EE2A24] font-bold text-sm hover:underline"
                    >
                      Choice Default
                    </button>
                  </div>
                </div>

                {isDesignModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative shadow-2xl">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-gray-900">
                          Choice Default
                        </h3>
                        <button
                          onClick={() => setIsDesignModalOpen(false)}
                          className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="p-6 overflow-y-auto flex-grow">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Placeholder images from modal */}
                          {DEFAULT_SIGNS.map((sign, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setCustomDesign(sign);
                                console.log("Selected default design:", sign);
                                setIsDesignModalOpen(false);
                              }}
                              className="aspect-square bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-[#EE2A24] cursor-pointer overflow-hidden p-2 transition-all flex items-center justify-center flex-col gap-2"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={sign.url}
                                alt={sign.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- Step 4: Typography --- */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Type size={18} className="text-[#EE2A24]" />
                  <h2 className="text-lg font-bold text-[#EE2A24]">
                    Step 4: Typography
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font
                    </label>
                    <select
                      value={config.font}
                      onChange={(e) =>
                        setConfig({ ...config, font: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none bg-white appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundPosition: "right 1rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.25rem",
                      }}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Helvetica (ADA Compliant)">
                        Helvetica (ADA Compliant)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Color
                    </label>
                    <div className="flex gap-2 flex-wrap items-center">
                        {defaultQuickFontColors.map((clr, idx) => (
                          <button
                            key={idx}
                            onClick={() => setConfig({ ...config, fontColor: clr })}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${config.fontColor === clr ? "border-[#EE2A24]" : "border-gray-200"}`}
                            style={{ backgroundColor: clr }}
                          />
                        ))}
                        <button
                          onClick={() => setIsFontColorModalOpen(true)}
                          className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all bg-white"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isFontColorModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
                        <button
                          onClick={() => setIsFontColorModalOpen(false)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                        >
                          <X size={18} />
                        </button>
                        <h3 className="font-bold text-gray-900 mb-6">
                          Font Color
                        </h3>
                        <div className="grid grid-cols-8 gap-3 max-h-80 overflow-y-auto p-1">
                          {uniqueFontColorOptions.map((clr, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setConfig({ ...config, fontColor: clr });
                                setIsFontColorModalOpen(false);
                              }}
                              className={`w-10 h-10 rounded-lg shadow-sm border-2 transition-all ${config.fontColor === clr ? "border-[#EE2A24]" : "border-gray-200 hover:border-gray-400"}`}
                              style={{ backgroundColor: clr }}
                            />
                          ))}
                        </div>
                        <div className="mt-8 flex gap-4">
                          <button
                            onClick={() => setIsFontColorModalOpen(false)}
                            className="w-1/2 py-3 border border-gray-300 rounded-xl font-bold bg-white hover:bg-gray-50"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setIsFontColorModalOpen(false)}
                            className="w-1/2 py-3 bg-[#EE2A24] text-white rounded-xl font-bold hover:bg-[#d6221c]"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* --- Step 5: Braille --- */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Eye size={18} className="text-[#EE2A24]" />
                  <h2 className="text-lg font-bold text-[#EE2A24]">
                    Step 5: Braille
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Add Braille
                      </h3>
                      <p className="text-sm text-gray-500">
                        Required for ADA compliance (+$8)
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setConfig({ ...config, braille: !config.braille })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${config.braille ? "bg-[#EE2A24]" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm transform transition-transform ${config.braille ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={config.quantity}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note
                    </label>
                    <input
                      type="text"
                      value={config.note}
                      onChange={(e) =>
                        setConfig({ ...config, note: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EE2A24] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- Pricing & Navigation --- */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              {currentStep === 5 ? (
                <div className="space-y-3 mb-6 font-medium">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Unit Price:</span>
                    <span className="text-gray-900">
                      ${unitPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Quantity:</span>
                    <span className="text-gray-900">×{config.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center font-extrabold text-lg pt-4 border-t border-gray-100">
                    <span className="text-gray-900">Total Price:</span>
                    <span className="text-[#EE2A24]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
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
              )}

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
                    {currentStep === 1
                      ? "Continue to Material"
                      : currentStep === 2
                        ? "Continue to Text"
                        : currentStep === 3
                          ? "Continue to Typography"
                          : "Continue to Braille"}
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
