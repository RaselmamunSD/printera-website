"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import axios from "@/lib/axios";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const FALLBACK_AVATAR_IMAGE = "/user.png";

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: "Rahat Ahmed",
    role: "Owner",
    company: "Retail Shop",
    image: "/users.png",
    rating: 5,
    content:
      "Their 3D plastic letters completely transformed my shop's storefront! The quality is amazing, and the letters look very premium. Highly recommended!",
  },
  {
    id: 2,
    name: "Samiul Islam",
    role: "Manager",
    company: "Restaurant",
    image: "/users.png",
    rating: 5,
    content:
      "I was worried about the rain and sun, but the signage they provided is truly weather-resistant. Even after a year, the colors look brand new.",
  },
  {
    id: 3,
    name: "Tanvir Hassan",
    role: "CEO & Founder",
    company: "Startup",
    image: "/users.png",
    rating: 4,
    content:
      "The laser-cutting on the acrylic letters was incredibly precise. They followed my brand's font exactly. Great attention to detail!",
  },
];

// 2. Sub-component for Stars
const RatingStars = ({ count }) => (
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < count ? "fill-amber-400 text-amber-400" : "text-gray-200"
        }`}
      />
    ))}
  </div>
);

// 3. Main Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex flex-col h-full transition-all duration-300 hover:shadow-md">
    {/* Header: Avatar & Info */}
    <div className="flex items-center gap-4 mb-6">
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
        <img
          src={testimonial.image || FALLBACK_AVATAR_IMAGE}
          alt={testimonial.name}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_AVATAR_IMAGE;
          }}
        />
      </div>
      <div>
        <h4 className="font-bold text-[#1e1e2d] text-lg leading-tight">
          {testimonial.name}
        </h4>
        <p className="text-gray-400 text-xs mt-1">
          {testimonial.role} <br /> {testimonial.company}
        </p>
      </div>
    </div>

    <RatingStars count={testimonial.rating} />

    {/* Quote Icon */}
    <div className="text-[#EE2A24] mb-4">
      <svg width="24" height="18" viewBox="0 0 24 18" fill="currentColor">
        <path d="M0 18V9.30233C0 6.32558 0.613953 3.97674 1.84186 2.25581C3.10698 0.511628 5.10698 -0.0465116 7.84186 0.0465116V4.18605C6.44651 4.18605 5.53953 4.4186 5.12093 4.88372C4.70233 5.34884 4.49302 6.16279 4.49302 7.32558V9.2093H8.31628V18H0ZM14.9395 18V9.30233C14.9395 6.32558 15.5535 3.97674 16.7814 2.25581C18.0465 0.511628 20.0465 -0.0465116 22.7814 0.0465116V4.18605C21.386 4.18605 20.4791 4.4186 20.0605 4.88372C19.6419 5.34884 19.4326 6.16279 19.4326 7.32558V9.2093H23.2558V18H14.9395Z" />
      </svg>
    </div>

    {/* Review Text */}
    <p className="text-gray-500 leading-relaxed text-[15px]">
      {testimonial.content}
    </p>
  </div>
);

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1, align: "start" },
    [
      Autoplay({
        playOnInit: true,
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("testimonials/");
        if (Array.isArray(response.data) && response.data.length > 0) {
          const mapped = response.data
            .filter((item) => item.is_active !== false)
            .map((item) => ({
              id: item.id,
              name: item.name,
              role: item.role || "",
              company: item.company || "",
              image: item.photo_url || FALLBACK_AVATAR_IMAGE,
              rating: item.rating || 5,
              content: item.review_text || "",
            }));

          if (mapped.length > 0) {
            setTestimonials(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="bg-[#FFF5F5] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-[#1e1e2d] mb-6">
            Testimonial
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Trusted for quality, loved for durability. Our customers rely on our
            precision-cut signs to make a lasting impression. Here&apos;s what
            they have to say about our craftsmanship.
          </p>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {(loading ? FALLBACK_TESTIMONIALS : testimonials).map((item) => (
              <div
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%] min-w-0 pl-4"
                key={item.id}
              >
                <TestimonialCard testimonial={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            className="p-3 rounded-full border border-transparent text-[#EE2A24] transition-all hover:bg-white hover:shadow-sm active:scale-95"
            aria-label="Previous testimonial"
            onClick={scrollPrev}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            className="p-3 rounded-full border border-transparent text-[#EE2A24] transition-all hover:bg-white hover:shadow-sm active:scale-95"
            aria-label="Next testimonial"
            onClick={scrollNext}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
