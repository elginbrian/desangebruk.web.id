"use client";

import React from "react";

const PetaLokasiSection = () => {
  const batasDesa = [
    { arah: "Utara", wilayah: "Kecamatan Kromengan" },
    { arah: "Timur", wilayah: "Kecamatan Kepanjen" },
    { arah: "Selatan", wilayah: "Desa Ternyang, Senggreng dan Sambigede" },
    { arah: "Barat", wilayah: "Desa Jatiguwi" },
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Peta Lokasi Desa</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1 space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-[#1B3A6D]">
                <div className="text-lg font-bold text-[#1B3A6D]">505,275</div>
                <div className="text-xs text-gray-600">Ha Luas Desa</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-[#1B3A6D]">
                <div className="text-lg font-bold text-[#1B3A6D]">7,847</div>
                <div className="text-xs text-gray-600">Jiwa Penduduk</div>
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Batas Wilayah Desa</h3>
              <div className="space-y-2">
                {batasDesa.map((batas, index) => (
                  <div key={index} className="flex justify-between items-start text-xs">
                    <span className="font-medium text-gray-700 w-12">{batas.arah}:</span>
                    <span className="text-gray-600 text-right flex-1">{batas.wilayah}</span>
                  </div>
                ))}
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Informasi Lokasi</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarak ke Kecamatan:</span>
                  <span className="font-medium text-gray-600">5 Km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarak ke Kabupaten:</span>
                  <span className="font-medium text-gray-600">25 Km</span>
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.794855555!2d112.5825!3d-8.1825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78f7c123456789%3A0x123456789abcdef!2sNgebruk%2C%20Sumberpucung%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
                title="Peta Desa Ngebruk"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetaLokasiSection;

