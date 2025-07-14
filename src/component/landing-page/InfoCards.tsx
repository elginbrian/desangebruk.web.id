"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiUsers, FiHome, FiFileText, FiBell, FiCloud, FiCloudRain } from "react-icons/fi";
import { usePublicStats } from "@/hooks/usePublicStats";
import { useWeather } from "@/hooks/useWeather";

const InfoCards = () => {
  const [mounted, setMounted] = useState(false);
  const { totalArticles, activeAnnouncements, loading } = usePublicStats();
  const { weather, loading: weatherLoading } = useWeather();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (weatherCode: string, description: string) => {
    const code = parseInt(weatherCode);

    if (code === 113) return FiSun;
    if ([116, 119, 122].includes(code)) return FiCloud;
    if ([119, 122, 143, 248, 260].includes(code)) return FiCloud;
    if ([176, 179, 182, 185, 200, 227, 230, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 323, 326, 356, 359, 362, 365, 368, 371, 374, 377, 386, 389, 392, 395].includes(code)) return FiCloudRain;

    return FiSun;
  };

  const cardData = [
    {
      icon: weather ? getWeatherIcon(weather.icon, weather.description) : FiSun,
      title: "Cuaca Hari Ini",
      value: weatherLoading ? "..." : weather ? `${weather.temperature}°C` : "26°C",
      subtitle: weatherLoading ? "Memuat..." : weather ? weather.description : "Partly Cloudy",
    },
    {
      icon: FiUsers,
      title: "Jumlah Penduduk",
      value: "2,847",
      subtitle: "Jiwa",
    },
    {
      icon: FiHome,
      title: "Jumlah RT",
      value: "39",
      subtitle: "Rukun Tetangga",
    },
  ];

  return (
    <section className={`py-8 md:py-10 bg-yellow-400 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-6">
          {cardData.map((card, index) => (
            <div key={index} className={`text-center md:text-left smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`} style={{ animationDelay: `${index * 0.1}s` }}>

              <div className="mb-4 md:mb-6 flex justify-center md:justify-start animate-float">
                <card.icon size={40} className="text-[#1B3A6D] md:w-12 md:h-12 smooth-transition hover:scale-110" />
              </div>


              <h3 className="text-lg md:text-xl font-semibold text-[#1B3A6D] mb-3 md:mb-4 smooth-transition">{card.title}</h3>


              <div className="text-3xl md:text-4xl font-bold text-[#1B3A6D] mb-2 smooth-transition hover:scale-105">{card.value}</div>


              <p className="text-sm text-[#1B3A6D] mb-1 smooth-transition">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;

