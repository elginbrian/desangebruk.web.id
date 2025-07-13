"use client";

import React, { useState, useEffect } from "react";

const AgendaSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  const agendaItems = [
    {
      id: 1,
      title: "Manual Teller Store 2024",
      date: "Hari ini, 10/07/2024",
      time: "18:00",
      category: "Rapat Desa",
      color: "bg-[#1B3A6D]",
    },
    {
      id: 2,
      title: "Rapat Permusyawaratan Desa",
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
    <section className={`py-12 md:py-16 bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Content */}
          <div className={`lg:col-span-2 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 smooth-transition">Agenda Desa Ngebruk</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed smooth-transition">
              Tetap terhubung dengan berbagai kegiatan dan pengumuman penting di Desa Ngebruk. Lihat jadwal hari ini, besok, maupun agenda yang akan datang informasi, kegiatan dan pengumuman informatif.
            </p>
          </div>

          {/* Agenda Cards */}
          <div className={`lg:col-span-1 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 smooth-transition">Kegiatan Mendatang</h3>
              {agendaItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-[#1B3A6D] text-white rounded-lg p-4 hover:bg-[#152f5a] smooth-transition cursor-pointer hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider smooth-transition">{item.category}</span>
                    <span className="text-xs smooth-transition">{item.time}</span>
                  </div>
                  <h4 className="font-semibold mb-1 text-sm line-clamp-2 smooth-transition hover:text-yellow-200">{item.title}</h4>
                  <p className="text-xs text-blue-200 smooth-transition">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
