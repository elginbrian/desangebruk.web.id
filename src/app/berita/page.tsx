"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";

const BeritaPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("berita");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample news data
  const newsData = [
    {
      id: 1,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-1",
    },
    {
      id: 2,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/stasiun_ngebruk.JPG",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-2",
    },
    {
      id: 3,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-3",
    },
    // Duplicate for more content
    {
      id: 4,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/stasiun_ngebruk.JPG",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-4",
    },
    {
      id: 5,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-5",
    },
    {
      id: 6,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/stasiun_ngebruk.JPG",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-6",
    },
    {
      id: 7,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-7",
    },
    {
      id: 8,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/stasiun_ngebruk.JPG",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-8",
    },
    {
      id: 9,
      title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Rai...",
      excerpt: "Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui...",
      date: "Rabu, 9 Juli 2025",
      image: "/kantor_desa.jpg",
      author: "Desa Ngebruk",
      views: "163",
      slug: "siaran-pers-kementerian-pariwisata-9",
    },
  ];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  const filteredNews = newsData.filter((news) => news.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 bg-[#1B3A6D] text-white shadow-sm">Berita</button>
              <Link href="/pengumuman">
                <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-900">Pengumuman</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className={`text-center mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">BERITA</h1>
          <p className="text-gray-600 mb-6">Semua Informasi Berita Desa Ngebruk</p>

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

        {/* News Grid */}
        <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentNews.map((news, index) => (
              <Link key={news.id} href={`/berita/${news.slug}`} className="group">
                <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "/kantor_desa.jpg";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm leading-relaxed group-hover:text-[#1B3A6D] transition-colors">{news.title}</h3>
                    <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed">{news.excerpt}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">DN</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{news.author}</p>
                          <p className="text-xs text-gray-500">{news.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">{news.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
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

export default BeritaPage;
