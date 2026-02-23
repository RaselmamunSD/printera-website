import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
// 1. Data structure for easy navigation updates
const FOOTER_LINKS = {
  company: [
    { label: "Products", href: "/products" },
    { label: "Promo Catalog", href: "/catalog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Request a Quote", href: "/quote" },
  ],
  help: [
    { label: "Contact Us", href: "/contact" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full">
      {/* --- Newsletter Section --- */}
      <section className="bg-[#F3F6FF] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <h2 className="text-[24px] font-extrabold text-[#1e1e2d] max-w-md leading-tight">
            Join Our Newsletter to Keep Up To Date With Us!
          </h2>

          <form className="flex w-full lg:max-w-xl gap-0">
            <input
              type="email"
              placeholder="Enter your Email"
              className="flex-grow px-6 py-4 rounded-l-xl border-y border-l border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EE2A24] focus:ring-inset"
              required
            />
            <button
              type="submit"
              className="bg-[#EE2A24] text-white text-xs lg:text-lg px-4 py-2 lg:px-8 lg:py-4 rounded-r-xl font-bold transition-all hover:bg-[#d6221c] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* --- Main Footer Section --- */}
      <section className="bg-[#14141F] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto ">
          <div className="lg:flex justify-between items-start gap-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-6 mb-8">
                <Image
                  src={logo}
                  alt="Plastic Letters"
                  width={275}
                  height={60}
                  className="object-contain"
                />
              </div>
              <p className="text-white leading-relaxed max-w-sm">
                Precise. Professional. Reliable. Your ultimate destination for
                high-quality printing services.
              </p>
            </div>
            <div className="lg:flex gap-[76px]">
              {/* Links Columns */}
              <div className="lg:col-span-3 my-5 lg:my-0">
                <h3 className="text-xl font-bold mb-6">Company</h3>
                <ul className="space-y-4">
                  {FOOTER_LINKS.company.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-light text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <h3 className="text-xl font-bold mb-6">Help</h3>
                <ul className="space-y-4">
                  {FOOTER_LINKS.help.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-light text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-5 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="text-[#EE2A24]">plastic Letters & Sign</span>.
              All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
