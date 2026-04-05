"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/apiClient";

// No default categories - wait for API to load
const DEFAULT_CATEGORIES = [];

const CategoryCard = ({ category, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {imageError && (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
            Image not available
          </div>
        )}
        {category.image_url && (
          <img
            src={category.image_url}
            alt={category.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              console.error(`Failed to load image: ${category.image_url}`);
            }}
          />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {category.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {category.description}
        </p>

        <Link
          href={"/products"}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#EE2A24] text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-[#D1221D]"
        >
          Explore
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default function CategoryBrowse() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/shop-by-products/categories/`);
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const data = await res.json();
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(
            data.categories.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description || "",
              image_url: item.image,
              href: item.explore_url || "/products",
            }))
          );
          setError(null);
        }
      } catch (error) {
        console.error("CategoryBrowse load failed:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="title">Browse Our Products</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loaders while loading
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">
            Failed to load categories: {error}
          </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat, index) => (
            <CategoryCard key={cat.id} category={cat} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No categories available
          </div>
        )}
      </div>
    </section>
  );
}
