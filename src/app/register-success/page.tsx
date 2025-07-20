"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Link from "next/link";
import Image from "next/image";

const RegisterSuccessPage = () => {
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

  return (
    <main>
      <Header />
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 fixed inset-0 overflow-hidden">
        <div className={`max-w-6xl w-full smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex-1 flex justify-center lg:justify-end relative">
              <div className="relative">
                <Image height={400} width={600} src="/register-success.png" alt="Page not found" className="max-w-full h-auto" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">Registrasi Berhasil</h1>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">Akun berhasil dibuat dan sedang menunggu persetujuan administrator. Silahkan hubungi administrator untuk melakukan konfirmasi pendaftaran.</p>

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
    </main>
  );
};

export default RegisterSuccessPage;
