"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiShare2, FiCalendar, FiAlertCircle } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import Link from "next/link";

const PengumumanDetailPage = () => {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample announcement data - in real app, fetch by slug
  const announcementData = {
    id: 1,
    title: "Pengumuman tentang Aksi Bersih Pegawai Pemerintah dengan Pernyataan Komitmen",
    content: `
      <p>Dalam rangka meningkatkan integritas dan komitmen pegawai pemerintah desa, dengan ini kami sampaikan pengumuman mengenai Aksi Bersih Pegawai Pemerintah Desa Ngebruk.</p>
      
      <p><strong>Latar Belakang:</strong><br>
      Sesuai dengan amanat untuk menciptakan pemerintahan yang bersih, transparan, dan akuntabel, Pemerintah Desa Ngebruk menyelenggarakan Aksi Bersih Pegawai Pemerintah dengan Pernyataan Komitmen.</p>
      
      <p><strong>Tujuan:</strong></p>
      <ul>
        <li>Meningkatkan integritas dan profesionalisme pegawai</li>
        <li>Mencegah terjadinya praktik korupsi, kolusi, dan nepotisme</li>
        <li>Mewujudkan pelayanan publik yang berkualitas</li>
        <li>Membangun kepercayaan masyarakat terhadap pemerintah desa</li>
      </ul>
      
      <p><strong>Waktu Pelaksanaan:</strong><br>
      Aksi Bersih akan dilaksanakan pada:</p>
      <ul>
        <li>Hari: Jumat</li>
        <li>Tanggal: 12 Juli 2024</li>
        <li>Waktu: 08.00 - 12.00 WIB</li>
        <li>Tempat: Balai Desa Ngebruk</li>
      </ul>
      
      <p><strong>Peserta:</strong><br>
      Seluruh pegawai pemerintah Desa Ngebruk, perangkat desa, dan perwakilan masyarakat.</p>
      
      <p><strong>Agenda Kegiatan:</strong></p>
      <ol>
        <li>Pembukaan oleh Kepala Desa</li>
        <li>Penandatanganan Pakta Integritas</li>
        <li>Sosialisasi peraturan anti korupsi</li>
        <li>Diskusi dan tanya jawab</li>
        <li>Penutupan</li>
      </ol>
      
      <p>Demikian pengumuman ini kami sampaikan. Atas perhatian dan partisipasi semua pihak, kami ucapkan terima kasih.</p>
    `,
    date: "Rabu, 3 Juli 2024",
    priority: "Penting",
    validUntil: "Jumat, 12 Juli 2024",
    slug: params?.slug || "aksi-bersih-pegawai-pemerintah",
  };

  // Related announcements
  const relatedAnnouncements = [
    {
      id: 2,
      title: "Pengumuman Hasil Akhir Seleksi Pegawai Pemerintah dengan Perjanjian Kerja",
      date: "Selasa, 2 Juli 2024",
      priority: "Normal",
      slug: "hasil-seleksi-pegawai-pemerintah",
    },
    {
      id: 3,
      title: "Pengumuman Jadwal Pelayanan Administrasi Desa Selama Bulan Ramadan",
      date: "Senin, 1 Juli 2024",
      priority: "Urgent",
      slug: "jadwal-pelayanan-ramadan",
    },
    {
      id: 4,
      title: "Pengumuman Penerimaan Bantuan Sosial untuk Keluarga Kurang Mampu",
      date: "Minggu, 30 Juni 2024",
      priority: "Penting",
      slug: "bantuan-sosial-keluarga-kurang-mampu",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: announcementData.title,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
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
            {/* Priority Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcementData.priority)}`}>
                {getPriorityIcon(announcementData.priority)}
                {announcementData.priority}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">{announcementData.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DN</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Pemerintah Desa Ngebruk</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <FiCalendar size={14} />
                <span className="text-sm">{announcementData.date}</span>
              </div>

              {announcementData.validUntil && (
                <div className="flex items-center gap-1 text-orange-600">
                  <FiAlertCircle size={14} />
                  <span className="text-sm">Berlaku hingga {announcementData.validUntil}</span>
                </div>
              )}

              <button onClick={handleShare} className="flex items-center gap-1 text-[#1B3A6D] hover:text-[#152f5a] transition-colors ml-auto">
                <FiShare2 size={14} />
                <span className="text-sm font-medium">Bagikan</span>
              </button>
            </div>

            {/* Announcement Body */}
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: announcementData.content }} />

            {/* Important Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Penting!</h4>
                  <p className="text-sm text-blue-800">Pengumuman ini berlaku hingga tanggal yang telah ditentukan. Untuk informasi lebih lanjut, silakan hubungi kantor desa atau kunjungi langsung Balai Desa Ngebruk.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Announcements */}
        <section className={`mt-12 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengumuman Terkait</h2>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {relatedAnnouncements.map((announcement, index) => (
                <Link key={announcement.id} href={`/pengumuman/${announcement.slug}`} className="block">
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Priority Badge */}
                        <div className="mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                            {getPriorityIcon(announcement.priority)}
                            {announcement.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#1B3A6D] transition-colors text-sm">{announcement.title}</h3>

                        {/* Date */}
                        <p className="text-xs text-gray-500">{announcement.date}</p>
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PengumumanDetailPage;
