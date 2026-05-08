"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "@/lib/axios";
import { API_URL } from "@/lib/apiClient";

const FALLBACK_PRODUCT_IMAGE = "/Products/product1.png";
const FALLBACK_MATERIAL_OPTIONS = ["Acrylic", "Metal", "Plastic"];
const FALLBACK_APPLICATION_OPTIONS = ["Indoor", "Outdoor"];

const isLocalBackendImage = (src) =>
  typeof src === "string" &&
  (src.startsWith(`${API_URL}/`) ||
    src.startsWith("http://127.0.0.1:8000/") ||
    src.startsWith("http://localhost:8000/"));

// 2. Sub-components for Cleanliness
const FilterGroup = ({ title, options, selectedOptions, onToggle }) => (
  <div className="mb-8">
    <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selectedOptions.includes(opt)}
            onChange={() => onToggle(opt)}
            className="w-5 h-5 border-gray-300 rounded text-[#EE2A24] focus:ring-[#EE2A24] cursor-pointer"
          />
          <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
            {opt}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageSrc = product.image_url || FALLBACK_PRODUCT_IMAGE;

  const description =
    product.description || product.category || "Custom product";
  const isLongDescription = description.length > 30;
  const truncatedDescription = isLongDescription
    ? description.slice(0, 30) + "..."
    : description;

  return (
    <>
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md h-full">
        <div className="relative aspect-4/3 bg-gray-50">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized={isLocalBackendImage(imageSrc)}
          />
        </div>
        <div className="p-5 flex flex-col grow">
          <h3 className="font-extrabold text-[#1e1e2d] text-lg mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-6 grow leading-relaxed">
            {truncatedDescription}
            {isLongDescription && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-1 text-[#EE2A24] hover:underline font-semibold focus:outline-none"
              >
                See more
              </button>
            )}
          </p>

          <div className="flex justify-between items-end mb-6">
            <span className="text-[#EE2A24] font-black text-xl">
              From ${product.price}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold text-right max-w-[50%]">
              {product.category || "General"}
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="w-full bg-[#EE2A24] flex justify-center items-center text-white py-3 rounded-xl font-bold transition-all hover:bg-[#d6221c] active:scale-[0.98]"
          >
            Customize Now
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full focus:outline-none"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              <div className="w-full md:w-1/2 p-6 bg-gray-50 flex flex-col border-r border-gray-100 shrink-0">
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-4 bg-white shadow-sm border border-gray-100">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-2"
                    unoptimized={isLocalBackendImage(imageSrc)}
                  />
                </div>
                <h3 className="font-extrabold text-[#1e1e2d] text-2xl mb-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-end mb-4 shrink-0">
                  <span className="text-[#EE2A24] font-black text-xl">
                    From ${product.price}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold text-right max-w-[50%]">
                    {product.category || "General"}
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col p-6 overflow-hidden">
                <h4 className="font-bold text-gray-900 mb-4">
                  Product Details
                </h4>
                <div className="flex-grow overflow-y-auto pr-2">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 shrink-0">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-full bg-[#EE2A24] flex justify-center items-center text-white py-3 rounded-xl font-bold transition-all hover:bg-[#d6221c] active:scale-[0.98]"
                  >
                    Customize Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function AllProductsPage() {
  const [priceRange, setPriceRange] = useState(170);
  const [maxPrice, setMaxPrice] = useState(170);
  const [products, setProducts] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Products:", products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const [productsResponse, optionsResponse] = await Promise.all([
          axios.get("/products/"),
          axios.get("/products/filter-options/"),
        ]);

        const fetchedProducts = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

        const fetchedMaterials = Array.isArray(optionsResponse.data?.materials)
          ? optionsResponse.data.materials
          : [];
        const fetchedApplications = Array.isArray(
          optionsResponse.data?.applications,
        )
          ? optionsResponse.data.applications
          : [];
        const highestPrice = fetchedProducts.reduce((max, product) => {
          const value = Number(product.price) || 0;
          return value > max ? value : max;
        }, 0);

        setProducts(fetchedProducts);
        setMaterialOptions(fetchedMaterials);
        setApplicationOptions(fetchedApplications);
        setMaxPrice(highestPrice > 0 ? Math.ceil(highestPrice) : 170);
        setPriceRange(highestPrice > 0 ? Math.ceil(highestPrice) : 170);
      } catch {
        setMaterialOptions(FALLBACK_MATERIAL_OPTIONS);
        setApplicationOptions(FALLBACK_APPLICATION_OPTIONS);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const withinPrice = Number(product.price) <= priceRange;
      const productMaterials = Array.isArray(product.materials)
        ? product.materials
        : [];
      const productApplications = Array.isArray(product.applications)
        ? product.applications
        : [];

      const materialMatch =
        selectedMaterials.length === 0 ||
        selectedMaterials.some((item) => productMaterials.includes(item));

      const applicationMatch =
        selectedApplications.length === 0 ||
        selectedApplications.some((item) => productApplications.includes(item));

      return withinPrice && materialMatch && applicationMatch;
    });
  }, [products, priceRange, selectedMaterials, selectedApplications]);

  const toggleMaterial = (option) => {
    setSelectedMaterials((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const toggleApplication = (option) => {
    setSelectedApplications((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const clearFilters = () => {
    setSelectedMaterials([]);
    setSelectedApplications([]);
    setPriceRange(maxPrice);
  };

  return (
    <main className="bg-[#F9FAFB] min-h-screen py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1e1e2d]">All Products</h1>
          <p className="text-gray-400 font-medium mt-1">
            {loading
              ? "Loading products..."
              : `${visibleProducts.length} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="text-xl font-black mb-8">Filters</h2>

              <FilterGroup
                title="Material"
                options={materialOptions}
                selectedOptions={selectedMaterials}
                onToggle={toggleMaterial}
              />
              <FilterGroup
                title="Application"
                options={applicationOptions}
                selectedOptions={selectedApplications}
                onToggle={toggleApplication}
              />

              {/* Custom Price Slider */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EE2A24]"
                />
                <div className="flex justify-between mt-3 text-sm font-bold text-gray-400">
                  <span>$0</span>
                  <span>${priceRange}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {!error && loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[360px] animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            )}

            {!error && !loading && visibleProducts.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-sm font-medium text-gray-500">
                No products found for this price range.
              </div>
            )}

            {!error && !loading && visibleProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
