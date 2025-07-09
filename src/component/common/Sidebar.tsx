"use client";

import { FiHome, FiFileText, FiBell, FiLogOut, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 // Only on mobile/tablet
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { icon: FiHome, text: "Dashboard", href: "/dashboard" },
    { icon: FiFileText, text: "Kelola Berita", href: "/dashboard/article" },
    { icon: FiBell, text: "Kelola Pengumuman", href: "/dashboard/announcement" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
        fixed lg:relative lg:translate-x-0 
        w-64 min-h-screen flex flex-col text-white bg-[#1B3A6D] shadow-lg 
        z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-lg smooth-transition hover:scale-110 active:scale-95">
            <FiX size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="p-4 border-b border-white/10 smooth-transition">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 smooth-transition hover:scale-105">
              <img
                src="/logo.png"
                alt="Desa Ngebruk Logo"
                className="w-10 h-10 object-contain smooth-transition"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  const svgElement = target.nextElementSibling as HTMLElement;
                  target.style.display = "none";
                  if (svgElement) {
                    svgElement.style.display = "block";
                  }
                }}
              />
              <svg className="w-10 h-10 text-white hidden smooth-transition" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.554 6.24L4.43 2.184c-.18-.12-.43-.12-.61 0L3.82 2.184C2.9 2.184 2 3.084 2 4.004v15.992c0 .92.9 1.82 1.82 1.82h16.36c.92 0 1.82-.9 1.82-1.82V4.004c0-.92-.9-1.82-1.82-1.82L20.18 2.184c-.18-.12-.43-.12-.61 0l-6.124 4.056c-.18.12-.43.12-.61 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white smooth-transition">Desa Ngebruk</h1>
              <p className="text-xs text-white/70 smooth-transition">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-4 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className={`animate-slide-in-left stagger-${index + 1}`}>
                <Link
                  href={item.href}
                  onClick={() => onClose()} // Close mobile menu when link is clicked
                  className={`
                    flex items-center px-4 py-3 rounded-lg smooth-transition text-xs group
                    hover:scale-105 active:scale-95
                    ${pathname === item.href ? "bg-white text-[#1B3A6D] font-medium shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <item.icon className={`mr-2 smooth-transition group-hover:scale-110 ${pathname === item.href ? "text-[#1B3A6D]" : ""}`} size={14} />
                  <span className="smooth-transition">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-2 border-t border-white/10">
          <a href="#" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 smooth-transition text-xs text-white/90 hover:text-white group hover:scale-105 active:scale-95">
            <FiLogOut className="mr-2 smooth-transition group-hover:scale-110" size={14} />
            <span className="smooth-transition">Logout</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
