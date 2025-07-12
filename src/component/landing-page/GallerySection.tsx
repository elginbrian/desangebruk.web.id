"use client";

import React from "react";

const GallerySection = () => {
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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {galleryImages.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-[#1B3A6D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#152f5a] transition-colors">Lihat Galeri Lengkap</button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
