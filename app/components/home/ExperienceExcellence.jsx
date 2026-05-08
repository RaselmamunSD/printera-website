import React from "react";
import Image from "next/image";
import { ThumbsUp, Settings, Lightbulb } from "lucide-react";
import excellenceTruck from "../../../public/experience excellence.png";
// 1. Feature Data for clean mapping
const FEATURES = [
  {
    title: "Uncompromising Quality",
    description:
      "We never settle for second best. Using the finest materials and rigorous standards, we ensure every print meets the highest level of perfection.",
    icon: ThumbsUp,
  },
  {
    title: "Extensive Range of Services",
    description:
      "From business cards to large-scale banners, we offer a comprehensive suite of printing solutions to meet every personal and professional requirement under one roof.",
    icon: Settings,
  },
  {
    title: "Custom Solution",
    description:
      "Unique projects require unique approaches. We provide tailor-made printing solutions specifically designed to align with your brand identity and goals.",
    icon: Lightbulb,
  },
];

const FeatureItem = ({ title, description, Icon }) => (
  <div className="flex gap-6 items-start group">
    {/* Icon Container */}
    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
      <Icon className="w-8 h-8 text-[#EE2A24] stroke-[1.5]" />
    </div>

    {/* Text Content */}
    <div className="flex flex-col">
      <h3 className="text-xl font-bold text-[#1e1e2d] mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-[15px]">{description}</p>
    </div>
  </div>
);

export default function ExperienceExcellence() {
  return (
    <section className="bg-[#FFF5F5] py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col">
          <span className="text-[#EE2A24] font-bold tracking-widest text-sm mb-4 uppercase">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1e1e2d] leading-[1.1] mb-6">
            Experience Excellence <br /> Service
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Unmatched quality, dedicated to your satisfaction.
          </p>

          {/* Features List */}
          <div className="space-y-10">
            {FEATURES.map((feature, index) => (
              <FeatureItem
                key={index}
                title={feature.title}
                description={feature.description}
                Icon={feature.icon}
              />
            ))}
          </div>
        </div>

        {/* Right Image Column with Decorative Border */}
        <div className="relative">
          {/* The Red Decorative Frame */}
          <div className="absolute -inset-2 border-[6px] border-[#EE2A24]/50 rounded-[2.5rem] pointer-events-none" />

          {/* Main Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src={excellenceTruck}
              alt="Experience Excellence Service"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
