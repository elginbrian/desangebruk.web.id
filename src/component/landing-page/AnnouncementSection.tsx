"use client";

import React from "react";

const AnnouncementSection = () => {
  const announcements = [
    {
      id: 1,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
    {
      id: 2,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
    {
      id: 3,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan...",
      date: "Rabu, 3 Juli 2024",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pengumuman</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">{announcement.date}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="text-[#1B3A6D] hover:text-[#152f5a] font-medium transition-colors">Lihat Pengumuman Lainnya</button>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementSection;
