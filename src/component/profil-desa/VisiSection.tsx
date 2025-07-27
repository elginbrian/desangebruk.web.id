"use client";

import React from "react";

const VisiSection = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Visi</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 mx-auto max-w-4xl ">
            <blockquote className="text-sm md:text-medium text-gray-700 leading-relaxed italic">
              "Terwujudnya masyarakat adil, makmur, dan sejahtera melalui peningkatan kualitas sumber daya manusia yang terdidik, maju, aman dengan didukung pengembangan ekonomi berbasis sumber daya alam."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiSection;
