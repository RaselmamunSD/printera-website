"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Zap, Package, Palette } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";

// Sub-Components
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col group">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm font-medium text-center px-4">
            {product.title}
          </span>
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <span className="text-[10px] font-bold text-[#EE2A24] uppercase tracking-wider mb-1">
        {product.category}
      </span>
      <h3 className="font-bold text-[#1e1e2d] text-lg mb-4">{product.title}</h3>
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="block text-[#EE2A24] font-black text-xl">
            ${product.price}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">per unit</span>
        </div>
        <div className="text-right">
          <span className="block text-gray-900 font-bold text-sm">
            {product.min} units
          </span>
          <span className="text-[10px] text-gray-400 font-medium">minimum</span>
        </div>
      </div>
      <Link href={"/request-quote"} className="w-full bg-[#EE2A24] text-white py-3 rounded-lg font-bold text-sm transition-colors hover:bg-[#d6221c] flex items-center justify-center">
        Request Quote
      </Link>
    </div>
  </div>
);

const CategoryBox = ({ name }) => (
  <a
    href="#"
    className="p-6 rounded-xl border bg-white border-[#EE2A24] transition-all group"
  >
    <h4 className="font-bold text-[#1e1e2d] mb-1">{name}</h4>
    <span className="text-[11px] text-[#EE2A24] font-semibold group-hover:underline">
      View products →
    </span>
  </a>
);

export default function PromotionalCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/products/promo-products/"),
          axios.get("/products/promo-categories/"),
        ]);
        const uniqueCategories = [...new Set(categoriesRes.data)];
        setProducts(productsRes.data);
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-[#1e1e2d] mb-4">
            Promotional Products Catalog
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Expand your brand reach with our extensive selection of promotional
            products, from corporate gifts to event giveaways, we&apos;ve got
            you covered.
          </p>
          <div className="inline-flex items-center gap-3 bg-[#FFF5F5] border border-[#FFDADA] px-6 py-3 rounded-xl text-[#EE2A24] text-sm font-medium">
            <div className="w-5 h-5 rounded-full border border-[#EE2A24] flex items-center justify-center text-[10px] font-black">
              !
            </div>
            ASI Integration: This page shows a preview of our promotional
            products. For access to our full catalog with thousands of items,
            click &quot;View Full Catalog&quot; below.
          </div>
        </div>

        {/* Featured Items Grid */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold text-[#1e1e2d]">
            Featured Promotional Items
          </h2>
          <button className="flex items-center gap-2 bg-[#EE2A24] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#d6221c]">
            View Full Catalog <ExternalLink size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-5 bg-gray-100 rounded w-2/3" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Categories Section */}
        <div className="bg-[#FFF8F8] -mx-6 px-6 py-20 rounded-[3rem] mb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center font-black text-xl mb-12">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <CategoryBox key={cat} name={cat} />
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="font-black text-xl mb-12">
            Why Choose Our Promotional Products?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Palette,
                title: "Custom Branding",
                desc: "Professional logo printing and embroidery services available",
              },
              {
                icon: Package,
                title: "Volume Discounts",
                desc: "Save more when you order in bulk for events or campaigns",
              },
              {
                icon: Zap,
                title: "Quick Turnaround",
                desc: "Rush production available for time-sensitive projects",
              },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center text-amber-500 mb-4">
                  <benefit.icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#1e1e2d] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
          <button className="mt-16 bg-[#EE2A24] text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-[#d6221c] flex items-center gap-2 mx-auto">
            Explore Full Catalog <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
