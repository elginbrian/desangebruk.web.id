"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiShare2, FiEye, FiCalendar } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";

const BeritaDetailPage = () => {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample news data - in real app, fetch by slug
  const newsData = {
    id: 1,
    title: "Siaran Pers: Kementerian Pariwisata Fasilitasi Geopark Kaldera Toba Raih Status UNESCO Global Geopark",
    content: `
      <p>Jakarta, 8 Juli 2025 - Kementerian Pariwisata berkomitmen untuk mendukung upaya meraih kembali green card bagi Kaldera Toba melalui program fasilitasi Geopark Kaldera Toba untuk meraih status UNESCO Global Geopark.</p>
      
      <p>Menteri Pariwisata, Sandiaga Uno, menyatakan bahwa Geopark Kaldera Toba memiliki potensi besar untuk menjadi destinasi wisata kelas dunia. "Kami optimis bahwa dengan dukungan penuh dari pemerintah dan masyarakat, Kaldera Toba dapat meraih pengakuan internasional sebagai UNESCO Global Geopark," ujar Sandiaga.</p>
      
      <p>Program fasilitasi ini meliputi peningkatan infrastruktur, pengembangan SDM, serta penguatan tata kelola geopark. Kementerian Pariwisata juga akan bekerja sama dengan berbagai stakeholder terkait untuk memastikan semua persyaratan UNESCO dapat dipenuhi.</p>
      
      <p>Kaldera Toba merupakan salah satu kaldera vulkanik terbesar di dunia dengan nilai geologis, budaya, dan ekologi yang sangat tinggi. Kawasan ini memiliki potensi besar untuk menjadi destinasi geoturisme yang berkelanjutan.</p>
      
      <p>Dengan dukungan penuh dari Kementerian Pariwisata, diharapkan Geopark Kaldera Toba dapat segera meraih status UNESCO Global Geopark dan menjadi kebanggaan Indonesia di mata dunia.</p>
    `,
    date: "Rabu, 9 Juli 2025",
    image: "/kantor_desa.jpg",
    author: "Desa Ngebruk",
    views: "163",
    category: "Kegiatan",
    slug: params?.slug || "siaran-pers-kementerian-pariwisata",
  };

  // Related news
  const relatedNews = [
    {
      id: 2,
      title: "Pembangunan Infrastruktur Desa Tahap II Segera Dimulai",
      image: "/stasiun_ngebruk.JPG",
      date: "Selasa, 8 Juli 2025",
      slug: "pembangunan-infrastruktur-desa",
    },
    {
      id: 3,
      title: "Festival Budaya Desa Ngebruk 2025 Akan Digelar Bulan Depan",
      image: "/kantor_desa.jpg",
      date: "Senin, 7 Juli 2025",
      slug: "festival-budaya-desa-ngebruk-2025",
    },
    {
      id: 4,
      title: "Program Bantuan Sosial untuk Masyarakat Kurang Mampu",
      image: "/stasiun_ngebruk.JPG",
      date: "Minggu, 6 Juli 2025",
      slug: "program-bantuan-sosial",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData.title,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className={`mb-6 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <Link href="/berita" className="inline-flex items-center text-[#1B3A6D] hover:text-[#152f5a] transition-colors">
            <FiArrowLeft className="mr-2" size={16} />
            <span className="text-sm font-medium">Kembali ke Berita</span>
          </Link>
        </div>

        {/* Article Header */}
        <article className={`bg-white rounded-xl shadow-sm overflow-hidden smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          {/* Featured Image */}
          <div className="aspect-video overflow-hidden">
            <img
              src={newsData.image}
              alt={newsData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/kantor_desa.jpg";
              }}
            />
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#1B3A6D] text-white text-xs font-medium rounded-full">{newsData.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">{newsData.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DN</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{newsData.author}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <FiCalendar size={14} />
                <span className="text-sm">{newsData.date}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <FiEye size={14} />
                <span className="text-sm">{newsData.views} views</span>
              </div>

              <button onClick={handleShare} className="flex items-center gap-1 text-[#1B3A6D] hover:text-[#152f5a] transition-colors ml-auto">
                <FiShare2 size={14} />
                <span className="text-sm font-medium">Bagikan</span>
              </button>
            </div>

            {/* Article Body */}
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: newsData.content }} />
          </div>
        </article>

        {/* Related News */}
        <section className={`mt-12 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((news, index) => (
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
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-relaxed group-hover:text-[#1B3A6D] transition-colors">{news.title}</h3>
                    <p className="text-xs text-gray-500">{news.date}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaDetailPage;
