"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../../public/logo.png";
import MobileNavbar from "./MobileNavbar";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import to detect current route
import { ShoppingCart, User } from "lucide-react";
import { fetchCart } from "@/lib/cart";

const Navbar = () => {
  const pathname = usePathname(); // Get current URL path
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        const cart = await fetchCart("shipping");
        if (isMounted) {
          setCartCount(cart.item_count || 0);
        }
      } catch {
        if (isMounted) {
          setCartCount(0);
        }
      }
    };

    const handleCartUpdated = (event) => {
      const nextCount = event.detail?.item_count;
      if (typeof nextCount === "number") {
        setCartCount(nextCount);
        return;
      }
      loadCart();
    };

    loadCart();
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  // Helper function to determine if a link is active
  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Promo Catalog", href: "https://plasticlettersandsigns.espwebsites.com/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Request a Quote", href: "/request-quote" },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-4 lg:px-0 max-w-[1200px] mx-auto">
      {/* logo */}
      <div>
        <Link href={"/"}>
          <Image src={logo} alt="Printera Logo" width={150} height={50} />
        </Link>
      </div>

      {/* NavLinks */}
      <div className="hidden lg:block">
        <ul className="flex space-x-8 text-[#364153]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-red-600 cursor-pointer transition-colors font-medium ${isActive(link.href) ? "text-red-600 font-bold" : ""
                }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>
      </div>

      <div className="hidden lg:flex items-center justify-between gap-6">
        <input
          type="text"
          className="input w-[256px]"
          placeholder="Search products..."
        />

        <div className="flex gap-2.5">
          <Link href="/cart" className="relative">
            <ShoppingCart
              color={isActive("/cart") ? "#DC2626" : "#3D3D3D"}
              size={32}
            />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#EE2A24] px-1.5 py-0.5 text-center text-[11px] font-black leading-none text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/dashboard">
            {" "}
            {/* Updated to link to dashboard based on your previous files */}
            <User
              color={
                pathname.startsWith("/dashboard") || isActive("/account") ?
                  "#DC2626"
                  : "#3D3D3D"
              }
              size={32}
            />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
