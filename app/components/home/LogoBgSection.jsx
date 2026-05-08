import React from "react";
import Image from "next/image";
import excellenceTruck from "../../../public/logobg.png";
import logo from "../../../public/clearlogo.png";
const HeroSection = () => {
  return (
    <section className="my-[50px]">
      <div className="relative w-full h-[400px] lg:h-[550px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={excellenceTruck}
          alt="Experience Excellence Service"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gray-400/70"></div>

        {/* Optional Content Area (if you want text later) */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Image
            src={logo}
            alt="Logo"
            width={783}
            height={170}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
