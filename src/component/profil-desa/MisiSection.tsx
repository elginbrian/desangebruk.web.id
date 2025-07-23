"use client";

import React from "react";

const MisiSection = () => {
  const misiList = [
    "Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",
    "Mengembangkan potensi ekonomi desa berbasis pertanian dan pariwisata",
    "Meningkatkan pelayanan publik yang prima dan transparan",
    "Membangun infrastruktur desa yang mendukung kesejahteraan masyarakat",
    "Melestarikan budaya lokal dan nilai-nilai kearifan lokal",
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Misi</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {misiList.map((misi, index) => (
              <div key={index} className="flex items-start bg-gray-50 rounded-lg p-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#1B3A6D] text-white rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5 text-sm">{index + 1}</span>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{misi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisiSection;
