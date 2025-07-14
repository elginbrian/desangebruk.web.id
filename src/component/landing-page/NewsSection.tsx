"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePublishedArticles } from "@/hooks/useArticles";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { LoadingSpinner, ErrorState, EmptyState, NewsCardSkeleton, CardSkeleton } from "@/component/common/LoadingStates";

const NewsSection = () => {
  const [mounted, setMounted] = useState(false);
  const { articles, loading: articlesLoading, error: articlesError, refetch: refetchArticles } = usePublishedArticles(4);
  const { announcements: activeAnnouncements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useActiveAnnouncements(3);

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

  const getNewsContent = () => {
    if (articlesLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {Array.from({ length: 2 }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (articlesError) {
      return <ErrorState message={articlesError} onRetry={refetchArticles} className="mb-6 md:mb-8" />;
    }

    if (articles.length === 0) {
      return <EmptyState title="Belum ada berita" description="Berita akan muncul di sini setelah dipublikasikan" className="mb-6 md:mb-8" />;
    }

    const newsData = articles.slice(0, 2);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {newsData.map((news, index) => (
            <Link
              key={news.id}
              href={`/berita/${news.slug}`}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl smooth-transition overflow-hidden group cursor-pointer hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >

              <div className="aspect-video overflow-hidden">
                <img src={news.imageUrl || "/kantor_desa.jpg"} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 smooth-transition" />
              </div>


              <div className="p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2 text-sm leading-relaxed smooth-transition group-hover:text-[#1B3A6D]">{news.title}</h3>
                <p className="text-gray-600 text-xs mb-3 md:mb-4 line-clamp-3 leading-relaxed smooth-transition">{news.excerpt || "Tidak ada excerpt"}</p>


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
    );
  };

  const getAnnouncementsContent = () => {
    if (announcementsLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} className="!p-4" />
          ))}
        </div>
      );
    }

    if (announcementsError) {
      return <ErrorState message={announcementsError} onRetry={refetchAnnouncements} />;
    }

    if (activeAnnouncements.length === 0) {
      return <EmptyState title="Belum ada pengumuman" description="Pengumuman akan muncul di sini ketika tersedia" />;
    }

    return (
      <>
        <div className="space-y-4 mb-6 md:mb-8">
          {activeAnnouncements.map((announcement, index) => (
            <Link
              key={announcement.id}
              href={`/pengumuman/${announcement.slug}`}
              className={`bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg smooth-transition cursor-pointer group hover-lift block ${mounted ? "smooth-reveal" : "animate-on-load"}`}
              style={{ animationDelay: `${(index + 5) * 0.1}s` }}
            >
              <h4 className="font-medium text-gray-900 mb-2 md:mb-3 text-sm leading-relaxed group-hover:text-[#1B3A6D] smooth-transition line-clamp-2">{announcement.title}</h4>
              <div className="flex items-center gap-2 text-gray-500 smooth-transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <p className="text-xs">{formatDate(announcement.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <Link href="/pengumuman" className="bg-[#1B3A6D] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-[#152f5a] smooth-transition text-sm btn-animate inline-block">
            Lihat Pengumuman Lainnya
          </Link>
        </div>
      </>
    );
  };

  return (
    <section className={`py-12 md:py-16 bg-gray-100 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          <div className={`lg:col-span-2 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Berita</h2>
            {getNewsContent()}
          </div>


          <div className={`lg:col-span-1 mt-8 lg:mt-0 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Pengumuman</h3>
            {getAnnouncementsContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

