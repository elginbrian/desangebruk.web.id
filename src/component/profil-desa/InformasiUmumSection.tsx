"use client";

import React from "react";

const InformasiUmumSection = () => {
  const penggunaanLahan = [
    { jenis: "Sawah", luas: "214,167 Ha", icon: "🌾" },
    { jenis: "Tanah Tegal", luas: "40,585 Ha", icon: "🌱" },
    { jenis: "Pemukiman", luas: "109,497 Ha", icon: "🏘️" },
    { jenis: "Hutan Jati", luas: "125,250 Ha", icon: "🌳" },
    { jenis: "Makam", luas: "1,050 Ha", icon: "⛪" },
    { jenis: "Lain-lain", luas: "14,276 Ha", icon: "📍" },
  ];

  const dataDusun = [
    {
      dusun: "Kebonsari",
      rt: 12,
      rw: 2,
      penduduk: 2185,
      kk: 695,
    },
    {
      dusun: "Krajan",
      rt: 14,
      rw: 2,
      penduduk: 3302,
      kk: 1000,
    },
    {
      dusun: "Mbodo",
      rt: 13,
      rw: 2,
      penduduk: 2360,
      kk: 748,
    },
  ];

  const dataAgama = [
    { agama: "Islam", total: 7773, persentase: "99.1%" },
    { agama: "Kristen", total: 46, persentase: "0.6%" },
    { agama: "Katholik", total: 28, persentase: "0.4%" },
    { agama: "Budha", total: 2, persentase: "0.03%" },
  ];

  const mataPencaharian = [
    { jenis: "Buruh Tani", jumlah: 1298, icon: "🌾" },
    { jenis: "Petani", jumlah: 817, icon: "👨‍🌾" },
    { jenis: "Swasta", jumlah: 614, icon: "💼" },
    { jenis: "Wiraswasta", jumlah: 489, icon: "🏪" },
    { jenis: "Tukang Bangunan", jumlah: 192, icon: "🔨" },
    { jenis: "Lainnya", jumlah: 175, icon: "👥" },
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Informasi Demografis</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">Data statistik dan demografi Desa Ngebruk</p>
        </div>

        <div className="space-y-8">

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Penggunaan Lahan</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {penggunaanLahan.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-600 mb-1">{item.jenis}</div>
                  <div className="text-sm font-semibold text-[#1B3A6D]">{item.luas}</div>
                </div>
              ))}
            </div>
          </div>


          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Penduduk per Dusun</h3>
              <div className="space-y-3">
                {dataDusun.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{item.dusun}</h4>
                      <span className="text-xs bg-[#1B3A6D] text-white px-2 py-1 rounded">{item.penduduk.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>RT: {item.rt}</div>
                      <div>RW: {item.rw}</div>
                      <div>KK: {item.kk}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Komposisi Agama</h3>
              <div className="space-y-2">
                {dataAgama.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 text-sm">{item.agama}</span>
                      <div className="text-right">
                        <span className="font-bold text-[#1B3A6D] text-sm">{item.total.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">({item.persentase})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Mata Pencaharian Utama</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {mataPencaharian.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-600 mb-1">{item.jenis}</div>
                  <div className="text-sm font-semibold text-[#1B3A6D]">{item.jumlah.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">orang</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformasiUmumSection;

