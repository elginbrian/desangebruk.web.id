"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Info Desa", href: "/info-desa" },
    { name: "Berita", href: "/berita" },
    { name: "Kegiatan", href: "/kegiatan" },
    { name: "Struktur", href: "/struktur" },
    { name: "Pelayanan", href: "/pelayanan" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Desa Ngebruk"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">Desa Ngebruk</h1>
              <p className="text-xs text-gray-500">Malang, Jawa Timur</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="bg-[#1B3A6D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] transition-colors">
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#1B3A6D] hover:bg-gray-100">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-700 hover:text-[#1B3A6D] px-3 py-2 text-sm font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <Link href="/login" className="bg-[#1B3A6D] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#152f5a] transition-colors mt-4" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
