"use client";

import React from "react";

const AgendaSection = () => {
  const agendaItems = [
    {
      id: 1,
      title: "APBD Desa 2024",
      date: "Hari ini, 10/07/2024",
      time: "18:00",
      category: "Rapat Desa",
      color: "bg-[#1B3A6D]",
    },
    {
      id: 2,
      title: "Badan Permusyawaratan Desa",
      date: "Besok, 11/07/2024",
      time: "19:00",
      category: "Rapat Desa",
      color: "bg-[#1B3A6D]",
    },
    {
      id: 3,
      title: "Rukun Warga",
      date: "Minggu, 14/07/2024",
      time: "10:00",
      category: "Kegiatan",
      color: "bg-green-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Agenda Desa Ngebruk</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Tetap terhubung dengan berbagai kegiatan dan pengumuman penting di Desa Ngebruk. Lihat jadwal hari ini, besok, maupun agenda yang akan datang informasi, kegiatan dan pengumuman informatif.
            </p>
          </div>

          {/* Agenda Cards */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Agenda</h3>
              <div className="space-y-4">
                {agendaItems.map((item) => (
                  <div key={item.id} className="bg-[#1B3A6D] text-white rounded-lg p-4 hover:bg-[#152f5a] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase">{item.category}</span>
                      <span className="text-xs">{item.time}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-blue-200">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
