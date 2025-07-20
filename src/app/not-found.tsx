"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/component/landing-page/Header";

const NotFoundPage = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main>
      <Header />
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 fixed inset-0 overflow-hidden">
        <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative">
                <Image height={400} width={600} src="/not-found.png" alt="Page not found" className="max-w-full h-auto" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Halaman Tidak Ditemukan</h1>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">Maaf, halaman yang Anda tuju tidak ditemukan. Silakan akses halaman lain melalui beranda.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/"
                    className="bg-[#1B3A6D] text-white px-8 py-2 rounded-lg font-medium border-2 border-[#1B3A6D] hover:bg-[#1B3A6D] hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Kembali
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed bottom-0 left-0 w-full bg-gray-200 py-4 md:py-4 smooth-transition z-10 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <img
              src="/logo-mmd.png"
              alt="Logo MMD"
              className="w-10 h-10 md:w-8 md:h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="text-center md:text-left">
              <p className="text-black font-medium text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh Tim MMD FILKOM 49 Tahun 2025</p>
              <p className="text-black/70 text-[10px] md:text-[10px] leading-relaxed smooth-transition">Program Mahasiswa Membangun Desa, Fakultas Ilmu Komputer, Universitas Brawijaya</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
