"use client";

import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/kantor_desa.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Selamat Datang di Desa Ngebruk</h1>
          <p className="text-lg md:text-xl mb-12 text-gray-200">Kampung Damai & Budaya Luhur, Harmoni Alam dan Kearifan Lokal</p>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
              <div className="text-2xl font-bold mb-2">01</div>
              <div className="text-sm text-gray-200">Pelayanan informasi penting</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
              <div className="text-2xl font-bold mb-2">02</div>
              <div className="text-sm text-gray-200">Pelayanan terbaik untuk warga</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
              <div className="text-2xl font-bold mb-2">03</div>
              <div className="text-sm text-gray-200">Untuk kemajuan desa dan masyarakat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
