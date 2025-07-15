"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import UserDropdown from "@/component/common/UserDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, profile, loading } = useAuth();
  const { logout } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Tentang", href: "/info-desa" },
    { name: "Berita", href: "/berita" },
    { name: "Pengumuman", href: "/pengumuman" },
    { name: "Struktur", href: "/struktur" },
    { name: "Pelayanan", href: "/pelayanan" },
  ];

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className={`flex items-center hover-lift smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <img
              src="/logo.png"
              alt="Desa Ngebruk"
              className="h-10 w-10 object-contain smooth-transition hover:scale-110"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900 smooth-transition">Desa Ngebruk</h1>
              <p className="text-xs text-gray-500 smooth-transition">Kecamatan Sumberpucung</p>
            </div>
          </div>

          <nav className={`hidden xl:flex space-x-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            {navigationItems.map((item, index) => (
              <Link key={item.name} href={item.href} className="text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium smooth-transition hover-lift" style={{ animationDelay: `${(index + 2) * 0.05}s` }}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className={`hidden xl:flex items-center space-x-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            {!loading && (
              <>
                {isAuthenticated && profile ? (
                  <UserDropdown />
                ) : (
                  <Link href="/login" className="bg-[#1B3A6D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition btn-animate">
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`xl:hidden p-2 rounded-md text-gray-700 hover:text-[#1B3A6D] hover:bg-gray-100 smooth-transition hover-lift ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-gray-200 animate-slide-in-left">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium smooth-transition hover-lift"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.name}
                </Link>
              ))}

              {!loading && (
                <>
                  {isAuthenticated && profile ? (
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="px-3 py-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                            <FiUser className="text-white" size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                            <p className="text-xs text-gray-500">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      <Link href="/dashboard" className="bg-[#1B3A6D] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition btn-animate flex items-center" onClick={() => setIsMenuOpen(false)}>
                        <FiUser className="mr-2" size={16} />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium smooth-transition text-left flex items-center"
                      >
                        <FiLogOut className="mr-2" size={16} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="bg-[#1B3A6D] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition mt-4 btn-animate" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
