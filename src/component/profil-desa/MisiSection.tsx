"use client";

import React from "react";

const MisiSection = () => {
  const misiList = [
    "Ikut melaksanakan/mengamalkan ajaran agama dalam kehidupan bermasyarakat berbangsa berbangsa dan bernegara sebagai wujud peningkatan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa.",
    "Mewujudkan dan mendorong terjadinya usaha-usaha kerukunan antar dan intern warga masyarakat yang disebabkan karena adanya perbedaan agama, keyakinan, organisasi, dan lainnya dalam suasana saling menghargai dan menghormati.",
    "Mengembangkan kehidupan masyarakat untuk terwujudnya tatanan masyarakat yang taat kepada peraturan perundang- undangan dalam rangka meningkatkan kehidupan masyarakat yang aman,tertib,tentram dan damai serta meningkatakan persatuan dan kesatuan dalam wadah negara kesatuan Republik Indonesia.",
    "Tewujudnya peningkatan kualitas kehidupan masyarakat yang ditandai terpenuhinya kebutuhan pangan, sandang, papan, kesehatan, pendidikan, dan lapangan kerja.",
    "Membangun dan meningkatkan hasil pertanian dengan jalan penataan pengairan, perbaikan jalan sawah jalan usaha tani, pemupukan, dan pola tanam yang baik.",
    "Pengembangan sektor pertanian dan perdagangan yang berorientasi pada mekanisme pasar.",
    "Menumbuhkembangkan usaha kecil dan menengah.",
    "Pemberdayaan ekonomi masyarakat khususnya UMKM (Usaha Kecil Menengah dan Mikro) yang berdaya saing tinggi.",
    "Membangun dan mendorong usaha-usaha untuk pengembangan dan optimalisasi sektor pertanian, perkebunan, peternakan, dan perikanan, baik tahap produksi maupun tahap pengolahan hasilnya.",
    "Meningkatkan kemajuan dan kemandirian melalui penyelenggaraan otonomi desa yang bertanggung jawab dan didukung dengan penyelenggaran pemerintahan yang bersih,transparan dan profesional.",
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Misi</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {misiList.map((misi, index) => (
              <div key={index} className="flex items-start bg-gray-50 rounded-lg p-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#1B3A6D] text-white rounded-full flex items-center justify-center font-semibold mr-3 mt-0.5 text-sm">{index + 1}</span>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{misi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisiSection;
