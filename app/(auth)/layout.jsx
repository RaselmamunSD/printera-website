import Image from "next/image";
import React from "react";
import logo1 from "../../public/auth/logo1.png";
import logo2 from "../../public/auth/logo2.png";
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {" "}
      {/* LEFT PANEL: BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF1F0] items-center justify-center p-12">
        <div className="max-w-md w-full flex flex-col items-center gap-12">
          {/* Main Logo Placeholder */}

          {/* Replace with actual logo path */}

          <Image
            src={logo1}
            alt="Printera Logo"
            height={166}
            width={400}
            className="object-contain"
          />
          <Image
            src={logo2}
            alt="Printera Logo"
            height={166}
            width={400}
            className="object-contain"
          />
        </div>
      </div>
      {children}

    </div>
  );
};

export default AuthLayout;
