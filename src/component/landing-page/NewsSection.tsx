"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const NewsSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const newsData = [
    {
      id: 1,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Raih...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      category: "Kegiatan",
      views: "133",
      author: "Desa Ngebruk",
    },
    {
      id: 2,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Raih...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/stasiun_ngebruk.JPG",
      category: "Kegiatan",
      views: "133",
      author: "Desa Ngebruk",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Pengumuman tentang Hasil Akhir Seleksi Pegawai Pemerintah dengan Perjanjian...",
      date: "Rabu, 2 Juli 2025",
    },
    {
      id: 2,
      title: "Pengumuman tentang Hasil Akhir Seleksi Pegawai Pemerintah dengan Perjanjian...",
      date: "Rabu, 2 Juli 2025",
    },
    {
      id: 3,
      title: "Pengumuman tentang Hasil Akhir Seleksi Pegawai Pemerintah dengan Perjanjian...",
      date: "Rabu, 2 Juli 2025",
    },
  ];

  return (
    <section className={`py-12 md:py-16 bg-gray-100 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Content - News */}
          <div className={`lg:col-span-2 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Berita</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {newsData.map((news, index) => (
                <div
                  key={news.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl smooth-transition overflow-hidden group cursor-pointer hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 smooth-transition" />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 text-sm leading-relaxed smooth-transition group-hover:text-[#1B3A6D]">{news.title}</h3>
                    <p className="text-gray-600 text-xs mb-3 md:mb-4 line-clamp-3 leading-relaxed smooth-transition">{news.excerpt}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#1B3A6D] rounded-full flex items-center justify-center hover-scale smooth-transition">
                          <span className="text-white text-xs font-bold">DN</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 smooth-transition">{news.author}</p>
                          <p className="text-xs text-gray-500 smooth-transition">{news.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 smooth-transition hover:text-[#1B3A6D]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">{news.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
              <button className="bg-[#1B3A6D] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-[#152f5a] smooth-transition text-sm btn-animate">Berita Lainnya</button>
            </div>
          </div>

          {/* Right Sidebar - Announcements */}
          <div className={`lg:col-span-1 mt-8 lg:mt-0 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Pengumuman</h3>
            <div className="space-y-4 mb-6 md:mb-8">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg smooth-transition cursor-pointer group hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}
                  style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                >
                  <h4 className="font-medium text-gray-900 mb-2 md:mb-3 text-sm leading-relaxed group-hover:text-[#1B3A6D] smooth-transition line-clamp-2">{announcement.title}</h4>
                  <div className="flex items-center gap-2 text-gray-500 smooth-transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs">{announcement.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
              <button className="bg-[#1B3A6D] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-[#152f5a] smooth-transition text-sm btn-animate">Lihat Pengumuman Lainnya</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
