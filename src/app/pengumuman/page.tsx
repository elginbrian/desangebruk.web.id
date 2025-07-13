"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";

const PengumumanPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("pengumuman");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample announcement data
  const announcementData = [
    {
      id: 1,
      title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan Komitmen",
      content: "Dalam rangka meningkatkan integritas dan komitmen pegawai pemerintah desa...",
      date: "Rabu, 3 Juli 2024",
      priority: "Penting",
      slug: "aksi-bersih-pegawai-pemerintah-1",
    },
    {
      id: 2,
      title: "Pengumuman tentang Hasil Akhir Seleksi Pegawai Pemerintah dengan Perjanjian Kerja",
      content: "Berdasarkan hasil seleksi yang telah dilaksanakan, berikut adalah pengumuman hasil akhir...",
      date: "Selasa, 2 Juli 2024",
      priority: "Normal",
      slug: "hasil-seleksi-pegawai-pemerintah",
    },
    {
      id: 3,
      title: "Pengumuman Jadwal Pelayanan Administrasi Desa Selama Bulan Ramadan",
      content: "Sehubungan dengan bulan suci Ramadan, kami informasikan perubahan jadwal pelayanan...",
      date: "Senin, 1 Juli 2024",
      priority: "Urgent",
      slug: "jadwal-pelayanan-ramadan",
    },
    // Duplicate for more content
    {
      id: 4,
      title: "Pengumuman Penerimaan Bantuan Sosial untuk Keluarga Kurang Mampu",
      content: "Dalam rangka membantu masyarakat kurang mampu, Pemerintah Desa Ngebruk mengumumkan...",
      date: "Minggu, 30 Juni 2024",
      priority: "Penting",
      slug: "bantuan-sosial-keluarga-kurang-mampu",
    },
    {
      id: 5,
      title: "Pengumuman Pembukaan Pendaftaran Posyandu Balita dan Lansia",
      content: "Pemerintah Desa Ngebruk mengundang seluruh masyarakat untuk berpartisipasi...",
      date: "Sabtu, 29 Juni 2024",
      priority: "Normal",
      slug: "pendaftaran-posyandu-balita-lansia",
    },
    {
      id: 6,
      title: "Pengumuman Penutupan Sementara Jalan Desa untuk Perbaikan",
      content: "Dalam rangka perbaikan infrastruktur jalan desa, dengan ini kami informasikan...",
      date: "Jumat, 28 Juni 2024",
      priority: "Urgent",
      slug: "penutupan-jalan-desa-perbaikan",
    },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(announcementData.length / itemsPerPage);

  const filteredAnnouncements = announcementData.filter((announcement) => announcement.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentAnnouncements = filteredAnnouncements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "Penting":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <Link href="/berita">
                <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-900">Berita</button>
              </Link>
              <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 bg-[#1B3A6D] text-white shadow-sm">Pengumuman</button>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className={`text-center mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PENGUMUMAN</h1>
          <p className="text-gray-600 mb-6">Semua Informasi Pengumuman Desa Ngebruk</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent smooth-transition"
            />
          </div>
        </div>

        {/* Announcements List */}
        <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
            <div className="divide-y divide-gray-200">
              {currentAnnouncements.map((announcement, index) => (
                <Link key={announcement.id} href={`/pengumuman/${announcement.slug}`} className="block">
                  <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Priority Badge */}
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>{announcement.priority}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors">{announcement.title}</h3>

                        {/* Content Preview */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{announcement.content}</p>

                        {/* Date */}
                        <p className="text-sm text-gray-500">{announcement.date}</p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="ml-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B3A6D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-center gap-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            «
          </button>

          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${currentPage === page ? "bg-[#1B3A6D] text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            »
          </button>

          {/* Page Info */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">Page</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className="w-12 h-8 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1B3A6D]"
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PengumumanPage;
