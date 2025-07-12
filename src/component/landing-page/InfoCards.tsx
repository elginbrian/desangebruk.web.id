"use client";

import React from "react";
import { FiSun, FiUsers, FiHome } from "react-icons/fi";

const InfoCards = () => {
  const cardData = [
    {
      icon: FiSun,
      title: "Cuaca Hari Ini",
      value: "28°C",
      subtitle: "Cerah Berawan",
      color: "bg-yellow-500",
    },
    {
      icon: FiUsers,
      title: "Jumlah Penduduk",
      value: "2,847",
      subtitle: "Jiwa",
      color: "bg-blue-500",
    },
    {
      icon: FiHome,
      title: "Jumlah RT",
      value: "36",
      subtitle: "Rukun Tetangga",
      color: "bg-green-500",
    },
  ];

  return (
    <section className="py-16 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full ${card.color} text-white`}>
                  <card.icon size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{card.title}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">{card.value}</div>
              <p className="text-sm text-gray-600">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
