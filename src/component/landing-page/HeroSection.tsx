"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/kantor_desa.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left text-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>Selamat Datang di Desa Ngebruk</h1>
          <p className={`text-sm sm:text-base md:text-lg mb-8 text-gray-200 max-w-2xl smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>Kampung Damai & Budaya Luhur, Harmoni Alam dan Kearifan Lokal</p>

          {/* Horizontal line separator */}
          <div className={`w-full h-px bg-white mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}></div>

          {/* Info sections without cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
            <div className="space-y-4 hover-lift smooth-transition">
              <div className="text-xl md:text-2xl font-bold text-white">01</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">Temukan informasi penting</h3>
              <p className="text-white text-sm leading-relaxed">Dapatkan berita terkini, agenda kegiatan, dan pengumuman lengkap dari Desa Ngebruk.</p>
            </div>

            <div className="space-y-4 hover-lift smooth-transition">
              <div className="text-xl md:text-2xl font-bold text-white">02</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">Nikmati pelayanan lebih mudah</h3>
              <p className="text-sm text-white leading-relaxed">Unduh formulir administrasi, cek persyaratan, dan datang dengan lebih siap.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
