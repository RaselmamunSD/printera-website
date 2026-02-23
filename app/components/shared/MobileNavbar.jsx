"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCancel, MdMenu } from "react-icons/md"; // Standardized icons
import Link from "next/link";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants for the dropdown
  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Trigger Button - Using button for accessibility */}
      <button
        onClick={toggleMenu}
        className="p-2 text-2xl text-slate-700 hover:text-blue-600 transition-colors focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ?
          <MdCancel />
        : <MdMenu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-56 p-2 origin-top-right 
                       bg-white/80 backdrop-blur-md border border-slate-200 
                       shadow-xl rounded-xl z-50 overflow-hidden"
          >
            <div className="flex flex-col space-y-1">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Promo Catalogue", href: "/promo-catalogue" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Request a Quote", href: "/request-quote" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-600 rounded-lg 
                             hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="my-2 border-slate-100" />

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center flex justify-center items-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;
