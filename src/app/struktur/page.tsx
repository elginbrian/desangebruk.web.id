"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";

const StrukturPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("PKK");

  usePageVisitor("Struktur");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "PKK", label: "PKK" },
    { id: "LPMD", label: "LPMD" },
    { id: "BPD", label: "BPD" },
    { id: "Desa", label: "Desa" },
  ];

  const structureData = {
    BPD: {
      title: "STRUKTUR BPD",
      image: "/struktur-bpd.png",
      description: "Struktur organisasi Badan Permusyawaratan Desa (BPD) Ngebruk",
    },
    PKK: {
      title: "STRUKTUR PKK",
      image: "/struktur-pkk.png",
      description: "Struktur organisasi Pemberdayaan Kesejahteraan Keluarga (PKK) Desa Ngebruk",
    },
    LPMD: {
      title: "STRUKTUR LPMD",
      image: "/struktur-lpmd.png",
      description: "Struktur organisasi Lembaga Pemberdayaan Masyarakat Desa (LPMD) Ngebruk",
    },
    Desa: {
      title: "STRUKTUR DESA",
      image: "/struktur-desa.png",
      description: "Struktur organisasi Pemerintahan Desa Ngebruk",
    },
  };

  const currentStructure = structureData[activeTab as keyof typeof structureData];

  const StructureDiagram = () => (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <img
          src={currentStructure.image}
          alt={currentStructure.title}
          className="w-full h-auto rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-structure.png";
          }}
        />
        <p className="text-center text-gray-600 mt-4 text-sm">{currentStructure.description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={`pt-12 pb-16 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === tab.id ? "bg-[#1B3A6D] text-white" : "text-gray-600 hover:text-[#1B3A6D] hover:bg-gray-50"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>


          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1B3A6D] mb-2">{currentStructure.title}</h1>
          </div>


          <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex items-center justify-center">
            <StructureDiagram />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StrukturPage;

