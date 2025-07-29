"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FiUsers, FiLoader, FiChevronDown } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";
import { useActiveStructures } from "@/hooks/useStructure";

const StrukturContent = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const structureId = searchParams?.get("id");

  usePageVisitor("Struktur");
  const { structures, loading, error } = useActiveStructures();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (structures.length > 0) {
      if (structureId) {
        const foundIndex = structures.findIndex((s) => s.id === structureId);
        if (foundIndex !== -1) {
          setActiveTab(foundIndex);
        } else {
          setActiveTab(0);
        }
      } else if (activeTab >= structures.length) {
        setActiveTab(0);
      }
    }
  }, [structures, structureId, activeTab]);

  const currentStructure = structures[activeTab] || null;

  const StructureDiagram = () => {
    if (!currentStructure) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada struktur yang tersedia</p>
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <img
            src={currentStructure.imageUrl}
            alt={currentStructure.name}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/struktur-desa.png";
            }}
          />
          <p className="text-center text-gray-600 mt-4 text-sm">{currentStructure.description}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FiLoader className="animate-spin h-8 w-8 text-[#1B3A6D] mx-auto mb-4" />
              <p className="text-gray-600">Memuat struktur organisasi...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && structures.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Struktur Organisasi</h2>
                  <p className="text-gray-600">Struktur organisasi desa sedang dalam proses pembaruan. Silakan kembali lagi nanti untuk melihat informasi terbaru.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={`pt-12 pb-16 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-center mb-8">
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 min-w-[280px] hover:border-[#1B3A6D] transition-colors">
                <span className="font-medium text-gray-900">{currentStructure ? currentStructure.name : "Pilih Struktur Organisasi"}</span>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {structures.map((structure, index) => (
                    <button
                      key={structure.id}
                      onClick={() => {
                        setActiveTab(index);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${activeTab === index ? "bg-[#1B3A6D] text-white hover:bg-[#152f5a]" : "text-gray-700"}`}
                    >
                      <div className="font-medium">{structure.name}</div>
                      {structure.description && (
                        <div className={`text-sm mt-1 ${activeTab === index ? "text-gray-200" : "text-gray-500"}`}>{structure.description.length > 60 ? `${structure.description.substring(0, 60)}...` : structure.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {dropdownOpen && <div className="fixed inset-0 z-5" onClick={() => setDropdownOpen(false)} />}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1B3A6D] mb-2">{currentStructure ? currentStructure.name.toUpperCase() : "STRUKTUR ORGANISASI"}</h1>
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

const StrukturPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <FiLoader className="animate-spin h-8 w-8 text-[#1B3A6D] mx-auto mb-4" />
                <p className="text-gray-600">Memuat struktur organisasi...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <StrukturContent />
    </Suspense>
  );
};

export default StrukturPage;

