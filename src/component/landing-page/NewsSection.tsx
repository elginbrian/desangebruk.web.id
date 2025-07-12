"use client";

import React from "react";
import Link from "next/link";

const NewsSection = () => {
  const newsData = [
    {
      id: 1,
      title: "Sukses Pelaksanaan Karnaval Kemerdekaan",
      excerpt: "Perayaan kemerdekaan di Desa Ngebruk sukses diselenggarakan dengan meriah...",
      date: "8 Agustus 2024",
      image: "/kantor_desa.jpg",
      category: "Kegiatan",
    },
    {
      id: 2,
      title: "Sukses Pelaksanaan Karnaval Kemerdekaan",
      excerpt: "Perayaan kemerdekaan di Desa Ngebruk sukses diselenggarakan dengan meriah...",
      date: "8 Agustus 2024",
      image: "/stasiun_ngebruk.JPG",
      category: "Kegiatan",
    },
  ];

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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - News */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Berita</h2>
            <div className="space-y-6">
              {newsData.map((news) => (
                <div key={news.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
                  <div className="flex">
                    <div className="w-1/3">
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="w-2/3 p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-[#1B3A6D] text-white px-3 py-1 rounded-full text-xs font-medium">{news.category}</span>
                        <span className="text-gray-500 text-sm ml-3">{news.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{news.excerpt}</p>
                      <Link href={`/berita/${news.id}`} className="text-[#1B3A6D] hover:text-[#152f5a] font-medium text-sm transition-colors">
                        Baca selengkapnya
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/berita" className="bg-[#1B3A6D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152f5a] transition-colors">
                Berita Lainnya
              </Link>
            </div>
          </div>

          {/* Right Sidebar - Announcements */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pengumuman</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">{announcement.title}</h4>
                    <p className="text-xs text-gray-500">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/pengumuman" className="text-[#1B3A6D] hover:text-[#152f5a] font-medium text-sm transition-colors">
                Lihat Pengumuman Lainnya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
