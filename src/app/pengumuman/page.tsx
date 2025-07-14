"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import { LoadingSpinner, ErrorState, EmptyState, CardSkeleton } from "@/component/common/LoadingStates";
import usePageVisitor from "@/hooks/usePageVisitor";

const PengumumanPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("pengumuman");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { announcements, loading, error, refetch } = useActiveAnnouncements();

  // Track visitor
  usePageVisitor("Pengumuman");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
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

  // Filter announcements based on search term
  const filteredAnnouncements = announcements.filter((announcement) => announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || announcement.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const currentAnnouncements = filteredAnnouncements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "penting":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "penting":
        return "Penting";
      default:
        return "Normal";
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <section className="bg-[#1B3A6D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pengumuman Desa Ngebruk</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">Dapatkan pengumuman terkini seputar kegiatan, pembangunan, dan perkembangan di Desa Ngebruk</p>
          </div>
        </div>
      </section>

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
              className="form-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black smooth-transition"
            />
          </div>
        </div>

        {/* Announcements List */}
        <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} className="py-12" />
          ) : currentAnnouncements.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
              <div className="divide-y divide-gray-200">
                {currentAnnouncements.map((announcement, index) => (
                  <Link key={announcement.id} href={`/pengumuman/${announcement.slug}`} className="block">
                    <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Priority Badge */}
                          <div className="mb-3">
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>{getPriorityLabel(announcement.priority)}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors">{announcement.title}</h3>

                          {/* Content Preview */}
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{announcement.content.length > 150 ? `${announcement.content.substring(0, 150)}...` : announcement.content}</p>

                          {/* Date */}
                          <p className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</p>
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
          ) : (
            <EmptyState
              title={searchTerm ? "Tidak ada pengumuman yang sesuai dengan pencarian" : "Belum ada pengumuman"}
              description={searchTerm ? "Coba gunakan kata kunci yang berbeda" : "Pengumuman akan muncul di sini setelah dipublikasikan"}
              className="py-12"
            />
          )}
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
