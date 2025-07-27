"use client";

import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import TabSelector from "@/component/pengumuman/TabSelector";
import SearchBar from "@/component/pengumuman/SearchBar";
import AnnouncementList from "@/component/pengumuman/AnnouncementList";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner, ErrorState, EmptyState, CardSkeleton } from "@/component/common/LoadingStates";
import { usePengumuman } from "@/hooks/usePengumuman";

const PengumumanPage = () => {
  const { mounted, searchTerm, currentPage, totalPages, currentAnnouncements, itemsPerPage, filteredAnnouncements, loading, error, refetch, handlePageChange, handleItemsPerPageChange, handleSearchChange } = usePengumuman();

  return (
    <div className={`min-h-screen bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <section className="bg-[#1B3A6D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pengumuman Desa Ngebruk</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">Dapatkan pengumuman terkini seputar kegiatan, pembangunan, dan perkembangan di Desa Ngebruk</p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabSelector mounted={mounted} />

        <SearchBar mounted={mounted} searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} className="py-12" />
        ) : currentAnnouncements.length > 0 ? (
          <>
            <AnnouncementList mounted={mounted} announcements={currentAnnouncements} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAnnouncements.length}
              loading={loading}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 15, 20]}
            />
          </>
        ) : (
          <EmptyState
            title={searchTerm ? "Tidak ada pengumuman yang sesuai dengan pencarian" : "Belum ada pengumuman"}
            description={searchTerm ? "Coba gunakan kata kunci yang berbeda" : "Pengumuman akan muncul di sini setelah dipublikasikan"}
            className="py-12"
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PengumumanPage;
