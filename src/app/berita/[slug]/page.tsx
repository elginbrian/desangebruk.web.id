"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiCalendar, FiUser, FiClock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { getArticleBySlug } from "@/lib/articleService";
import { Article } from "@/lib/articleService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const BeritaDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        const articleData = await getArticleBySlug(slug);

        if (articleData && articleData.status === "published") {
          setArticle(articleData);
        } else {
          setError("Artikel tidak ditemukan atau belum dipublikasikan");
        }
      } catch (err) {
        setError("Gagal memuat artikel");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit baca`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || "Artikel tidak ditemukan"}</h2>
            <p className="text-gray-600 mb-4">Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
            <Link href="/berita" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3A6D] text-white rounded hover:bg-[#152f5a] transition-colors">
              <FiArrowLeft size={16} />
              Kembali ke Berita
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B3A6D] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-[#1B3A6D] transition-colors">
              Berita
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <main className="flex-grow bg-white py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/berita" className="inline-flex items-center gap-2 text-[#1B3A6D] hover:text-[#152f5a] transition-colors mb-6">
            <FiArrowLeft size={16} />
            Kembali ke Berita
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FiUser size={16} />
                <span>{article.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>{formatReadingTime(article.content)}</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{
                __html: article.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Diterbitkan pada {formatDate(article.createdAt)}
                {article.updatedAt && article.updatedAt !== article.createdAt && <span> • Diperbarui pada {formatDate(article.updatedAt)}</span>}
              </div>
              <Link href="/berita" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3A6D] text-white rounded hover:bg-[#152f5a] transition-colors">
                Lihat Berita Lainnya
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaDetailPage;
