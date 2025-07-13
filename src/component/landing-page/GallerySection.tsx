"use client";

import React, { useState, useEffect } from "react";

const GallerySection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const galleryImages = [
    {
      id: 1,
      src: "/kantor_desa.jpg",
      alt: "Kantor Desa Ngebruk",
      title: "Kantor Desa",
    },
    {
      id: 2,
      src: "/stasiun_ngebruk.JPG",
      alt: "Stasiun Ngebruk",
      title: "Stasiun Ngebruk",
    },
    {
      id: 3,
      src: "/kantor_desa.jpg",
      alt: "Kegiatan Desa",
      title: "Kegiatan Desa",
    },
    {
      id: 4,
      src: "/stasiun_ngebruk.JPG",
      alt: "Budaya Lokal",
      title: "Budaya Lokal",
    },
    {
      id: 5,
      src: "/kantor_desa.jpg",
      alt: "Alam Desa",
      title: "Alam Desa",
    },
    {
      id: 6,
      src: "/stasiun_ngebruk.JPG",
      alt: "Aktivitas Masyarakat",
      title: "Aktivitas Masyarakat",
    },
  ];

  // Create multiple repetitions of images for seamless scrolling
  const repeatedImagesRow1 = Array(4).fill(galleryImages).flat();
  const repeatedImagesRow2 = Array(4).fill(galleryImages).flat();

  return (
    <section className={`py-8 md:py-12 bg-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        {/* First Row - Scrolling Left */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-left gap-3 md:gap-6">
            {repeatedImagesRow1.map((image, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 w-48 h-64 md:w-64 md:h-96 group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover-lift smooth-transition">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/kantor_desa.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Scrolling Right */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-right gap-3 md:gap-6">
            {repeatedImagesRow2.map((image, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 w-48 h-64 md:w-64 md:h-96 group cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover-lift smooth-transition">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/kantor_desa.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button Section with Container */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="text-center">
          <button className="bg-[#1B3A6D] text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold hover:bg-[#152f5a] smooth-transition text-sm md:text-base btn-animate">Lihat Galeri Lainnya</button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
