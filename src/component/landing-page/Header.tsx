"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import UserDropdown from "@/component/common/UserDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
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
    { name: "Tentang", href: "/tentang" },
    { name: "Berita", href: "/berita" },
    { name: "Pengumuman", href: "/pengumuman" },
    { name: "Struktur", href: "/struktur" },
    { name: "Pelayanan", href: "/pelayanan" },
  ];

  const isActivePath = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const getNavLinkClass = (href: string, isMobile: boolean = false) => {
    const baseClass = isMobile ? "navbar-link text-gray-700 px-3 py-3 text-sm font-medium rounded-md transition-all duration-300" : "navbar-link text-gray-700 px-4 py-2 text-sm font-medium rounded-md";

    const activeClass = isMobile ? "active-mobile" : "active";
    const isActive = isActivePath(href);

    return `${baseClass} ${isActive ? activeClass : ""}`;
  };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className={`flex items-center smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <div className="navbar-logo">
              <img
                src="/logo.png"
                alt="Desa Ngebruk"
                className="h-10 w-10 object-contain smooth-transition"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900 smooth-transition">Desa Ngebruk</h1>
              <p className="text-xs text-gray-500 smooth-transition">Kecamatan Sumberpucung</p>
            </div>
          </div>

          <nav className={`hidden xl:flex space-x-2 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            {navigationItems.map((item, index) => (
              <Link key={item.name} href={item.href} className={getNavLinkClass(item.href)} style={{ animationDelay: `${(index + 2) * 0.05}s` }}>
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
                  <Link href="/login" className="bg-[#1B3A6D] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition btn-animate">
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
            {isMenuOpen ? <FiX size={24} className="smooth-transition" /> : <FiMenu size={24} className="smooth-transition" />}
          </button>
        </div>


        <div className={`xl:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${getNavLinkClass(item.href, true)} mobile-menu-stagger-${index + 1} ${isMenuOpen ? "mobile-menu-item animate" : "mobile-menu-item"}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transitionDelay: `${index * 0.05}s`,
                  }}
                >
                  <span className="relative">
                    {item.name}
                    {isActivePath(item.href) && <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-[#1B3A6D] rounded-full"></span>}
                  </span>
                </Link>
              ))}

              {!loading && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  {isAuthenticated && profile ? (
                    <div className="space-y-3">
                      <div className="px-3 py-3 bg-gray-50 rounded-md smooth-transition hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#1B3A6D] rounded-full flex items-center justify-center user-avatar">
                            <FiUser className="text-white" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                            <p className="text-xs text-gray-500">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        className="bg-[#1B3A6D] text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition btn-animate flex items-center justify-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="mr-2" size={16} />
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 text-sm font-medium smooth-transition rounded-md text-left flex items-center justify-center"
                      >
                        <FiLogOut className="mr-2" size={16} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="bg-[#1B3A6D] text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-[#152f5a] smooth-transition btn-animate flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

