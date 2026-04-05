import React from "react";
import call from "../../../public/call.png";
import mail from "../../../public/mail.png";
import fb from "../../../public/fb.png";
import x from "../../../public/x.png";
import insta from "../../../public/insta.png";
import whatsapp from "../../../public/whatsapp.png";
import Image from "next/image";
const Ad = () => {
  return (
    <div className="bg-[#EB221E] py-3">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 py-2 text-sm">
        {/* Contact */}
        <div className="hidden lg:flex justify-center items-center gap-12">
          {/* call */}
          <div>
            <Image
              src={call}
              width={22}
              height={22}
              alt="Call Icon"
              className="inline-block mr-2"
            />
            <h3 className="text-white inline-block">14064389351</h3>
          </div>

          {/* email */}
          <div>
            <Image
              src={mail}
              width={22}
              height={22}
              alt="Mail Icon"
              className="inline-block mr-2"
            />
            <h3 className="text-white inline-block">
              info@plasticlettersandsigns.com
            </h3>
          </div>
        </div>
        {/* Social */}
        <div className="flex gap-[10px]">
          <Image src={fb} width={22} height={22} alt="Facebook Icon" />
          <Image src={x} width={22} height={22} alt="X Icon" />
          <Image src={insta} width={22} height={22} alt="Instagram Icon" />
          <div className="w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center">
            <Image src={whatsapp} alt="WhatsApp Icon" width={10} height={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ad;
