"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import NewsCard from "@/component/common/NewsCard";
import { LoadingSpinner, ErrorState, EmptyState, NewsCardSkeleton } from "@/component/common/LoadingStates";
import { usePublishedArticles } from "@/hooks/useArticles";
import usePageVisitor from "@/hooks/usePageVisitor";
import Link from "next/link";

const BeritaPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const { articles, loading, error, refetch } = usePublishedArticles();

  usePageVisitor("Berita");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal memuat berita</h2>
            <p className="text-gray-600">{error}</p>
            <button onClick={refetch} className="mt-4 px-4 py-2 bg-[#1B3A6D] text-white rounded hover:bg-[#152f5a] transition-colors">
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />


      <section className="bg-[#1B3A6D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Berita Desa Ngebruk</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">Dapatkan berita terkini seputar kegiatan, pembangunan, dan perkembangan di Desa Ngebruk</p>
          </div>
        </div>
      </section>


      <section className="py-8 bg-white">
        <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 bg-[#1B3A6D] text-white ">Berita</button>
              <Link href="/pengumuman">
                <button className="px-8 py-3 font-medium text-sm transition-all duration-20 text-gray-600 hover:text-gray-900">Pengumuman</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari"
                className="form-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black"
              />
            </div>
          </form>
        </div>
      </section>


      <main className="flex-grow bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} className="py-12" />
          ) : currentArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentArticles.map((article) => (
                  <NewsCard key={article.id} id={article.id!} title={article.title} excerpt={article.excerpt} imageUrl={article.imageUrl} authorName={article.authorName} createdAt={article.createdAt} slug={article.slug} />
                ))}
              </div>


              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm text-gray-600 hover:text-[#1B3A6D] disabled:opacity-50 disabled:cursor-not-allowed">
                    Sebelumnya
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 text-sm rounded ${currentPage === page ? "bg-[#1B3A6D] text-white" : "text-gray-600 hover:text-[#1B3A6D] hover:bg-gray-100"}`}>
                      {page}
                    </button>
                  ))}

                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm text-gray-600 hover:text-[#1B3A6D] disabled:opacity-50 disabled:cursor-not-allowed">
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState title={searchTerm ? "Tidak ada berita yang ditemukan" : "Belum ada berita"} description={searchTerm ? "Coba gunakan kata kunci yang berbeda" : "Berita akan muncul di sini setelah dipublikasikan"} className="py-12" />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaPage;

