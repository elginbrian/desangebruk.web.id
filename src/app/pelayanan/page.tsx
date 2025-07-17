"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AnnouncementsContent from "@/component/landing-page/AnnouncementsContent";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";

interface SubLayanan {
  id: string;
  title: string;
  persyaratan: string[];
}

interface Layanan {
  id: string;
  title: string;
  icon: string;
  estimasi: string;
  tarif: string;
  persyaratan?: string[];
  tataCara: string[];
  subLayanan?: SubLayanan[];
}

const PelayananPage = () => {
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const { announcements: activeAnnouncements, loading: announcementsLoading, error: announcementsError, refetch: refetchAnnouncements } = useActiveAnnouncements(3);

  usePageVisitor("Pelayanan");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Service data based on the actual procedures from the notice board
  const layananData = [
    {
      id: "persyaratan-pengurusan-ektp",
      title: "PERSYARATAN PENGURUSAN E-KTP",
      subLayanan: [
        {
          id: "ektp-baru",
          title: "1. E-KTP BARU (Belum Perekaman)",
          persyaratan: ["Fotocopy KK terbaru", "F1.03 (Formulir Pengantar)"],
        },
        {
          id: "ektp-perubahan",
          title: "2. E-KTP Perubahan/Hilang",
          persyaratan: ["Fotocopy KK terbaru", "F1.03 (Formulir Pengantar)", "E-KTP Asli"],
        },
        {
          id: "ektp-hilang",
          title: "3. E-KTP Hilang",
          persyaratan: ["Fotocopy KK terbaru", "F1.03 (Formulir Pengantar)", "Surat Kehilangan dari Polsek"],
        },
      ],
      tataCara: [],
    },
    {
      id: "persyaratan-pengurusan-kartu-keluarga",
      title: "PERSYARATAN PENGURUSAN KARTU KELUARGA",
      subLayanan: [
        {
          id: "pembaharuan-kk",
          title: "1. Pembaharuan KK/KK lama menjadi barcode",
          persyaratan: ["Formulir KK", "KK Asli", "Fotocopy berwarna buku nikah jika suami istri", "Fotocopy berwarna Berkas Pendukung (Ijazah/SK, dll)", "Materai 10.000 1 lembar"],
        },
        {
          id: "tambah-anggota-kk",
          title: "2. Tambah Anggota KK/Bayi baru lahir",
          persyaratan: ["Formulir KK", "KK Asli", "Fotocopy berwarna Buku Nikah orangtua", "Fotocopy berwarna Surat Kelahiran dari Bidan/Rumah Sakit yang ada stempelnya"],
        },
        {
          id: "hapus-anggota-kk",
          title: "3. Hapus Anggota KK sudah meninggal",
          persyaratan: ["Formulir KK", "KK Asli", "Fotocopy Akta kematian (jika belum memiliki akta kematian harus membuat akta kematian terlebih dahulu)"],
        },
        {
          id: "pecah-kk",
          title: "4. Pecah KK",
          persyaratan: ["Formulir KK", "KK Asli", "Fotocopy Berwarna Buku Nikah", "Fotocopy berwarna surat kelahiran dari Bidan/RS (jika tambah anggota)", "Surat Pindah (jika pindah tempat)", "Materai 10.000 1 lembar (jika pindah tempat)"],
        },
      ],
      tataCara: [],
    },
    {
      id: "persyaratan-pengurusan-akta-kelahiran",
      title: "PERSYARATAN PENGURUSAN AKTA KELAHIRAN",
      persyaratan: [
        "Formulir Akta Kelahiran",
        "Fotocopy KK terbaru",
        "Fotocopy Berwarna E-KTP orangtua (ayah dan ibu)",
        "Fotocopy Berwarna Surat Kelahiran dari Bidan/RS yang ada stempelnya (SPTJM kelahiran dari Desa)",
        "Fotocopy Berwarna Buku Nikah Orangtua (SPTJM Pernikahan dari Desa)",
        "Materai 10.000 1 lembar (jika memakai SPTJM materai 3 lembar)",
      ],
      tataCara: [],
    },
    {
      id: "persyaratan-pengurusan-akta-kematian",
      title: "PERSYARATAN PENGURUSAN AKTA KEMATIAN",
      persyaratan: [
        "Formulir Akta Kematian",
        "Fotocopy berwarna KK almarhum",
        "Fotocopy berwarna E-KTP Pelapor",
        "Fotocopy Berwarna E-KTP Pelapor (Pelapor harus 1 kk dengan yang meninggal)",
        "Fotocopy berwarna KK pelapor (jika pelapor tidak 1 kk dengan yang meninggal)",
        "Fotocopy E-KTP Saksi 2 orang (tidak boleh 1 kk dengan yang meninggal)",
        "Tidak usah membuat SPTJM R-KW jika almarhum meninggal di Rumah Sakit (Lampirkan fotocopy berwarna Surat Kematian dari Rumah Sakit)",
        "Materai 10.000 2 lembar jika ada SPTJM, jika tidak ada SPTJM Materai 10.000 1 lembar",
      ],
      tataCara: [],
    },
    {
      id: "persyaratan-pindah-tempat",
      title: "PERSYARATAN PINDAH TEMPAT",
      persyaratan: ["Formulir Pindah Tempat", "KK Asli", "Fotocopy berwarna buku nikah (jika pindah ikut suami/istri)", "Materai 10.000 1 lembar", "Formulir KK (jika pindah ikut suami/istri)"],
      tataCara: [],
    },
    {
      id: "persyaratan-pengurusan-kia",
      title: "PERSYARATAN PENGURUSAN KIA (Kartu Identitas Anak)",
      persyaratan: ["Fotocopy berwarna KK", "Fotocopy Akta Kelahiran", "Pas Foto Anak jika anak diatas 5 tahun (background bebas)"],
      tataCara: [],
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Title and Content */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Layanan Desa Ngebruk</h1>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <p className="text-gray-700 leading-relaxed text-justify">
                Selamat datang di bagian Layanan website Desa Ngebruk! Kami hadir untuk memudahkan Anda dalam setiap langkah pembuatan surat yang Anda butuhkan. Di sini, kami menyediakan berbagai layanan pembuatan surat yang dirancang untuk
                memenuhi kebutuhan administrasi warga desa.
              </p>
            </div>

            {/* Accordion Services */}
            <div className="space-y-3">
              {layananData.map((layanan, index) => (
                <div key={layanan.id} className={`bg-white rounded-lg shadow-sm overflow-hidden smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <button onClick={() => toggleExpanded(layanan.id)} className="w-full px-6 py-4 flex items-center justify-between text-left bg-[#1B3A6D] text-white hover:bg-[#152f5a] transition-colors text-sm font-medium">
                    <span>{layanan.title}</span>
                    {expandedItems[layanan.id] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </button>

                  {expandedItems[layanan.id] && (
                    <div className="px-6 py-4 bg-gray-50">
                      {layanan.subLayanan ? (
                        // Render sub-layanan untuk KK
                        <div className="space-y-6">
                          {layanan.subLayanan.map((subLayanan, subIndex) => (
                            <div key={subLayanan.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              <h4 className="font-semibold text-[#1B3A6D] mb-3 text-sm">{subLayanan.title}</h4>
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2 text-xs">Persyaratan:</h5>
                                <ul className="space-y-1">
                                  {subLayanan.persyaratan.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                                      <span className="w-2 h-2 bg-[#1B3A6D] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                      <span className="flex-1">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Render normal untuk layanan lainnya
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Persyaratan</h4>
                          <ul className="space-y-2">
                            {layanan.persyaratan &&
                              layanan.persyaratan.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                                  <span className="w-2 h-2 bg-[#1B3A6D] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  <span className="flex-1">{item}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-8 lg:mt-0 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 smooth-transition">Pengumuman</h3>
            <AnnouncementsContent activeAnnouncements={activeAnnouncements} announcementsLoading={announcementsLoading} announcementsError={announcementsError} refetchAnnouncements={refetchAnnouncements} mounted={mounted} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PelayananPage;
