"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FiShield, FiLogOut, FiHome } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Link from "next/link";
import Image from "next/image";

const UnauthorizedPage = () => {
  const [mounted, setMounted] = useState(false);
  const { profile, user, loading } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    // Only apply overflow hidden on large screens
    const applyOverflowHidden = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";
      } else {
        document.body.style.overflow = "auto";
        document.body.style.height = "auto";
      }
    };

    applyOverflowHidden();
    window.addEventListener("resize", applyOverflowHidden);

    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", applyOverflowHidden);
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push("/login");
    }
  }, [loading, user, profile, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:block">
      <Header />
      <div className="h-screen lg:h-screen lg:w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:fixed lg:inset-0 lg:overflow-hidden">
        <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative">
                <Image height={400} width={600} src="/unauthorized.png" alt="Page not found" className="max-w-full h-auto" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Akses Ditolak</h1>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">Anda tidak memiliki izin untuk mengakses halaman ini. Silahkan hubungi administrator mendapatkan akses.</p>

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
      <div className={`w-full bg-gray-200 py-4 md:py-4 smooth-transition lg:fixed lg:bottom-0 lg:left-0 lg:z-20 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <img
                src="/logo-ub.png"
                alt="Logo UB"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-filkom.png"
                alt="Logo FILKOM"
                className="w-auto h-5 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-diktisaintek.png"
                alt="Logo Diktisaintek Berdampak"
                className="w-auto h-6 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-mmd.png"
                alt="Logo MMD"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>

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

export default UnauthorizedPage;
