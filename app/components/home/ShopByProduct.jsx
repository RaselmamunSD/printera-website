"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

const FALLBACK_PRODUCT_IMAGE = "/Products/product1.png";

const ProductCard = ({ product }) => (
  <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
    {/* Image Container - Fixed Aspect Ratio */}
    <div className="relative aspect-[16/11] bg-gray-50">
      <Image
        src={product.image_url || FALLBACK_PRODUCT_IMAGE}
        alt={product.title}
        fill
        className="object-cover"
      />
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-semibold text-gray-900 text-base mb-3 leading-tight h-[40px]">
        {product.title}
      </h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-5">
        {product.description}
      </p>

      {/* Pricing & Materials Row */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-col">
          <span className="text-[#EE2A24] font-bold text-lg">
            From ${product.price}
          </span>
        </div>
        <div className="text-[11px] text-gray-400 font-medium text-right">
          {(product.materials || []).join(", ")}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/products/${product.id}`}
        className="w-full bg-[#EE2A24] text-white py-2.5 rounded-lg font-bold text-sm transition-all hover:bg-[#d6221c] active:scale-[0.98] flex justify-center items-center"
      >
        Customize Now
      </Link>
    </div>
  </div>
);

export default function ShopByProduct() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState({
    title: "Shop by Product",
    subtitle: "Find the perfect signage solution for your industry",
    view_all_text: "View All Products",
    products: [],
  });

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get("/shop-by-products/");
        if (response?.data) {
          setSection({
            title: response.data.title || "Shop by Product",
            subtitle:
              response.data.subtitle || "Find the perfect signage solution for your industry",
            view_all_text: response.data.view_all_text || "View All Products",
            products: Array.isArray(response.data.products) ? response.data.products : [],
          });
        }
      } catch {
        // Keep safe fallback state for homepage rendering.
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, []);

  return (
    <section className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="title">{section.title}</h2>
          <p className="mt-3 sub-title">
            {section.subtitle}
          </p>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading &&
            [...Array(4)].map((_, index) => (
              <div
                key={`shop-skeleton-${index}`}
                className="h-[360px] rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="h-[180px] animate-pulse rounded-xl bg-gray-100" />
                <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
                <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>
            ))}

          {!loading &&
            section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {!loading && section.products.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h3 className="text-lg font-bold text-gray-900">No products configured yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add products from Django Admin under Shop By Products section to display cards here.
            </p>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-[#EE2A24] font-semibold hover:underline group"
          >
            {section.view_all_text}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
