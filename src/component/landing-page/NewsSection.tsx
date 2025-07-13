"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePublishedArticles } from "@/hooks/useArticles";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const NewsSection = () => {
  const [mounted, setMounted] = useState(false);
  const { articles, loading, error } = usePublishedArticles(4); // Ambil 4 artikel terbaru

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  // Tampilkan berita dummy jika tidak ada data dari Firebase atau ada error
  const newsData =
    articles.length > 0
      ? articles.slice(0, 2)
      : [
          {
            id: "1",
            title: "Selamat Datang di Website Desa Ngebruk",
            excerpt: "Website resmi Desa Ngebruk telah hadir untuk memberikan informasi terkini tentang kegiatan, pengumuman, dan perkembangan di desa kami.",
            createdAt: new Date(),
            imageUrl: "/kantor_desa.jpg",
            authorName: "Desa Ngebruk",
            slug: "selamat-datang-website-desa-ngebruk",
          },
          {
            id: "2",
            title: "Pembangunan Infrastruktur Desa Terus Berlanjut",
            excerpt: "Pemerintah Desa Ngebruk terus berkomitmen dalam pembangunan infrastruktur untuk meningkatkan kesejahteraan masyarakat.",
            createdAt: new Date(),
            imageUrl: "/stasiun_ngebruk.JPG",
            authorName: "Desa Ngebruk",
            slug: "pembangunan-infrastruktur-desa",
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

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-2"></div>
                <div className="text-gray-600">Memuat berita...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  {newsData.map((news, index) => (
                    <Link
                      key={news.id}
                      href={`/berita/${news.slug}`}
                      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl smooth-transition overflow-hidden group cursor-pointer hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}
                      style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                    >
                      {/* Image */}
                      <div className="aspect-video overflow-hidden">
                        <img src={news.imageUrl || "/kantor_desa.jpg"} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 smooth-transition" />
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 text-sm leading-relaxed smooth-transition group-hover:text-[#1B3A6D]">{news.title}</h3>
                        <p className="text-gray-600 text-xs mb-3 md:mb-4 line-clamp-3 leading-relaxed smooth-transition">{news.excerpt || "Tidak ada excerpt"}</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#1B3A6D] rounded-full flex items-center justify-center hover-scale smooth-transition">
                              <span className="text-white text-xs font-bold">DN</span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900 smooth-transition">{news.authorName}</p>
                              <p className="text-xs text-gray-500 smooth-transition">{formatDate(news.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
                  <Link href="/berita" className="bg-[#1B3A6D] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-[#152f5a] smooth-transition text-sm btn-animate inline-block">
                    Berita Lainnya
                  </Link>
                </div>
              </>
            )}
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
