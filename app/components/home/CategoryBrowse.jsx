import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import img1 from "../../../public/ADA Signage.png";
import img2 from "../../../public/Office Nameplates.png";
import img3 from "../../../public/Banners & Displays.png";
import img4 from "../../../public/Custom Engraving.png";
import Link from "next/link";
// 1. Data Structure for easy maintenance
const CATEGORIES = [
  {
    title: "ADA Signage",
    description:
      "Compliant room signs, restroom markers, and directional signage with Braille",
    image: img1, // Replace with your paths
    href: "#",
  },
  {
    title: "Office Nameplates",
    description:
      "Professional desk nameplates, door signs, and employee identification",
    image: img2,
    href: "#",
  },
  {
    title: "Banners & Displays",
    description: "Promotional banners, trade show displays, and event signage",
    image: img3,
    href: "#",
  },
  {
    title: "Custom Engraving",
    description:
      "Decals, stickers, labels, and specialized custom printing services",
    image: img4,
    href: "#",
  },
];

const CategoryCard = ({ category }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {category.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {category.description}
        </p>

        {/* Button */}
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
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="title">Browse Our Products</h2>

      </div>

      {/* Grid Layout: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, index) => (
          <CategoryCard key={index} category={cat} />
        ))}
      </div>
    </section>
  );
}
