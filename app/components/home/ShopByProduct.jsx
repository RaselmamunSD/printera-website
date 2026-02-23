import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import product1 from "../../../public/Products/product1.png";
import product2 from "../../../public/Products/product2.png";
import product3 from "../../../public/Products/product3.png";
import product4 from "../../../public/Products/product4.png";
import product5 from "../../../public/Products/product5.png";
import product6 from "../../../public/Products/product6.png";
import product7 from "../../../public/Products/product7.png";
import product8 from "../../../public/Products/product8.png";
import Link from "next/link";
const PRODUCTS = [
  {
    id: 1,
    title: "ADA Restroom Sign",
    description: "ADA compliant restroom signage with Braille",
    price: 45,
    materials: ["Acrylic", "Plastic"],
    image: product1,
  },
  {
    id: 2,
    title: "ADA Room Identification Sign",
    description: "Customizable room number signs with Braille",
    price: 38,
    materials: ["Acrylic", "Metal", "Plastic"],
    image: product2,
  },
  {
    id: 3,
    title: "Vinyl Banner",
    description: "Durable vinyl banners for any event",
    price: 65,
    materials: ["Plastic"],
    image: product3,
  },
  {
    id: 4,
    title: "Engraved Cover Plates",
    description: "Cover Plate plate with engraving",
    price: 5,
    materials: ["Plastic"],
    image: product4,
  },
  {
    id: 5,
    title: "Nameplate",
    description: "Professional metal nameplates",
    price: 28,
    materials: ["Acrylic", "Metal", "Plastic"],
    image: product5,
  },
  {
    id: 6,
    title: "Custom Decal",
    description: "Custom printed decals and stickers",
    price: 15,
    materials: ["Acrylic", "Metal", "Plastic"],
    image: product6,
  },
  {
    id: 7,
    title: "Aluminum Sign",
    description: "Weather-resistant aluminum signs",
    price: 55,
    materials: ["Metal"],
    image: product7,
  },
  {
    id: 8,
    title: "Phenolic & Equipment Tags",
    description:
      "Durable engraved tags for reliable industrial identification.",
    price: 25,
    materials: ["Metal", "Plastic"],
    image: product8,
  },
];

const ProductCard = ({ product }) => (
  <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
    {/* Image Container - Fixed Aspect Ratio */}
    <div className="relative aspect-[16/11] bg-gray-50">
      <Image
        src={product.image}
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
          {product.materials.join(", ")}
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
  return (
    <section className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="title">Shop by Product</h2>
          <p className="mt-3 sub-title">
            Find the perfect signage solution for your industry
          </p>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-[#EE2A24] font-semibold hover:underline group"
          >
            View All Products
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
