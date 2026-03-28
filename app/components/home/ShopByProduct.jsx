"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";

const FALLBACK_PRODUCT_IMAGE = "/Products/product1.png";

const ProductCard = ({ product }) => {
  const productHref = `/products/${product.id}`;
  const imageSrc = product.image_url || FALLBACK_PRODUCT_IMAGE;
  const [currentImage, setCurrentImage] = useState(imageSrc);

  useEffect(() => {
    setCurrentImage(imageSrc);
  }, [imageSrc]);

  return (
    <div className="mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="relative aspect-[16/11] bg-gray-50">
        <Image
          src={currentImage}
          alt={product.title}
          fill
          unoptimized={currentImage !== FALLBACK_PRODUCT_IMAGE}
          className="object-cover"
          onError={() => {
            if (currentImage !== FALLBACK_PRODUCT_IMAGE) {
              setCurrentImage(FALLBACK_PRODUCT_IMAGE);
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-4">
        <h3 className="mb-3 min-h-[40px] text-base font-semibold leading-tight text-gray-900">
          {product.title}
        </h3>
        <p className="mb-4 min-h-[40px] text-sm text-gray-500 line-clamp-2">
          {product.description || "Custom printed decals and signage for your brand."}
        </p>

        {/* Pricing & Materials Row */}
        <div className="mb-5 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#EE2A24]">From</span>
            <span className="text-3xl font-bold leading-none text-[#EE2A24]">
              ${product.price}
            </span>
          </div>
          <div className="max-w-[110px] text-right text-[11px] font-medium leading-tight text-gray-400">
            {(product.materials || []).length > 0 ? (product.materials || []).join(", ") : "Acrylic, Metal, Plastic"}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={productHref}
          className="mt-auto flex w-full items-center justify-center rounded-lg bg-[#EE2A24] py-2.5 text-sm font-bold text-white transition-all hover:bg-[#d6221c] active:scale-[0.98]"
        >
          Customize Now
        </Link>
      </div>
    </div>
  );
};

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
        <div className="grid justify-items-center grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
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
