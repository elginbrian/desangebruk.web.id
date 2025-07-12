"use client";

import React from "react";
import { FiInstagram, FiYoutube, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#1B3A6D] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Desa Info */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Desa Ngebruk"
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="ml-3">
                <h3 className="text-xl font-bold">Desa Ngebruk</h3>
                <p className="text-blue-200 text-sm">Malang, Jawa Timur</p>
              </div>
            </div>
            <p className="text-blue-200 mb-6">
              Jl. Raya No. 7, Ngebruk, Kec. Sumberpucung,
              <br />
              Kabupaten Malang, Jawa Timur 65165
            </p>
          </div>

          {/* Right - Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <div className="space-y-2 mb-6">
              <p className="text-blue-200">📞 (0341) 123456</p>
              <p className="text-blue-200">✉️ ngebruk@gmail.com</p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <FiYoutube size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-blue-200">© 2024 Desa Ngebruk. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
