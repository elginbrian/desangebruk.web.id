"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiShare2, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";
import { useAnnouncementBySlug, useActiveAnnouncements } from "@/hooks/useAnnouncements";

const PengumumanDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);

  const { announcement, loading, error } = useAnnouncementBySlug(slug);
  const { announcements: relatedAnnouncements } = useActiveAnnouncements(3);

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

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startFormatted = format(start, "dd MMM yyyy", { locale: idLocale });
      const endFormatted = format(end, "dd MMM yyyy", { locale: idLocale });
      
      if (startDate === endDate) {
        return startFormatted;
      }
      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      return "";
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { color: "bg-green-100 text-green-800", label: "Aktif" };
      case "inactive":
        return { color: "bg-yellow-100 text-yellow-800", label: "Belum Aktif" };
      case "expired":
        return { color: "bg-red-100 text-red-800", label: "Kedaluwarsa" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Memuat pengumuman...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 mb-4">
              {error || "Pengumuman tidak ditemukan"}
            </div>
            <Link
              href="/pengumuman"
              className="text-[#1B3A6D] hover:underline"
            >
              Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusBadge(announcement.status);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
      case "Penting":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className={`mb-6 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <Link href="/pengumuman" className="inline-flex items-center text-[#1B3A6D] hover:text-[#152f5a] transition-colors">
            <FiArrowLeft className="mr-2" size={16} />
            <span className="text-sm font-medium">Kembali ke Pengumuman</span>
          </Link>
        </div>

        {/* Announcement Content */}
        <article className={`bg-white rounded-xl shadow-sm overflow-hidden smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Priority Badge and Status */}
            <div className="mb-4 flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                {getPriorityLabel(announcement.priority)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">{announcement.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DN</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{announcement.authorName}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <FiCalendar size={14} />
                <span className="text-sm">{formatDate(announcement.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1 text-orange-600">
                <FiAlertCircle size={14} />
                <span className="text-sm">Berlaku: {formatDateRange(announcement.startDate, announcement.endDate)}</span>
              </div>

              <button onClick={handleShare} className="flex items-center gap-1 text-[#1B3A6D] hover:text-[#152f5a] transition-colors ml-auto">
                <FiShare2 size={14} />
                <span className="text-sm font-medium">Bagikan</span>
              </button>
            </div>

            {/* Announcement Body */}
            <div className="prose prose-gray max-w-none">
              {announcement.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* Important Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Penting!</h4>
                  <p className="text-sm text-blue-800">Pengumuman ini berlaku dari tanggal {formatDateRange(announcement.startDate, announcement.endDate)}. Untuk informasi lebih lanjut, silakan hubungi kantor desa atau kunjungi langsung Balai Desa Ngebruk.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Announcements */}
        <section className={`mt-12 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengumuman Terkait</h2>

          {relatedAnnouncements.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {relatedAnnouncements.filter(related => related.id !== announcement.id).slice(0, 3).map((related, index) => (
                  <Link key={related.id} href={`/pengumuman/${related.slug}`} className="block">
                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Priority Badge */}
                          <div className="mb-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(related.priority)}`}>
                              {getPriorityLabel(related.priority)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors text-sm">{related.title}</h3>

                          {/* Date */}
                          <p className="text-xs text-gray-500">{formatDate(related.createdAt)}</p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="ml-4 flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1B3A6D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">Tidak ada pengumuman terkait</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PengumumanDetailPage;
