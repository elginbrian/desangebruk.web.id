"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiUsers, FiHome, FiFileText, FiBell } from "react-icons/fi";
import { usePublicStats } from "@/hooks/usePublicStats";

const InfoCards = () => {
  const [mounted, setMounted] = useState(false);
  const { totalArticles, activeAnnouncements, loading } = usePublicStats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const cardData = [
    {
      icon: FiFileText,
      title: "Total Berita",
      value: loading ? "..." : totalArticles.toString(),
      subtitle: "Artikel Dipublikasi",
    },
    {
      icon: FiBell,
      title: "Pengumuman Aktif",
      value: loading ? "..." : activeAnnouncements.toString(),
      subtitle: "Pengumuman Berlaku",
    },
    {
      icon: FiUsers,
      title: "Jumlah Penduduk",
      value: "2,847",
      subtitle: "Jiwa",
    },
  ];

  return (
    <section className={`py-8 md:py-10 bg-yellow-400 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {cardData.map((card, index) => (
            <div key={index} className={`text-center md:text-left smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Icon */}
              <div className="mb-4 md:mb-6 flex justify-center md:justify-start animate-float">
                <card.icon size={40} className="text-[#1B3A6D] md:w-12 md:h-12 smooth-transition hover:scale-110" />
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-[#1B3A6D] mb-3 md:mb-4 smooth-transition">{card.title}</h3>

              {/* Value */}
              <div className="text-3xl md:text-4xl font-bold text-[#1B3A6D] mb-2 smooth-transition hover:scale-105">{card.value}</div>

              {/* Subtitle */}
              <p className="text-sm text-[#1B3A6D] mb-1 smooth-transition">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
