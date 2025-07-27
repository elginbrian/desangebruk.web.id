"use client";

import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner, ErrorState, EmptyState, DataTableWithStates } from "@/component/common/LoadingStates";
import { useAnnouncementsPagination, useAnnouncementActions } from "@/hooks/useAnnouncements";

const AnnouncementPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { announcements, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchAnnouncementsPaginated, searchAnnouncementsPaginated, goToPage, changeItemsPerPage } = useAnnouncementsPagination();

  const { remove, loading: deleteLoading } = useAnnouncementActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        if (statusFilter === "Expired") return "expired";
        return "all";
      };
      fetchAnnouncementsPaginated(1, itemsPerPage, getStatusFilter());
    }
  }, [statusFilter, mounted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchAnnouncementsPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted) {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            if (statusFilter === "Expired") return "expired";
            return "all";
          };
          fetchAnnouncementsPaginated(1, itemsPerPage, getStatusFilter());
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted]);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      const success = await remove(id.toString());
      if (success) {
        if (isSearching) {
          searchAnnouncementsPaginated(searchTerm);
        } else {
          const getStatusFilter = () => {
            if (statusFilter === "Active") return "active";
            if (statusFilter === "Inactive") return "inactive";
            if (statusFilter === "Expired") return "expired";
            return "all";
          };
          fetchAnnouncementsPaginated(currentPage, itemsPerPage, getStatusFilter());
        }
      }
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/announcement/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        if (statusFilter === "Expired") return "expired";
        return "all";
      };
      fetchAnnouncementsPaginated(page, itemsPerPage, getStatusFilter());
    }
    goToPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const getStatusFilter = () => {
      if (statusFilter === "Active") return "active";
      if (statusFilter === "Inactive") return "inactive";
      if (statusFilter === "Expired") return "expired";
      return "all";
    };
    changeItemsPerPage(newItemsPerPage, getStatusFilter());
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
    };

    const statusLabels = {
      active: "Aktif",
      inactive: "Belum Aktif",
      expired: "Kedaluwarsa",
    };

    return <span className={`app-button-small font-medium smooth-transition ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800"}`}>{statusLabels[status as keyof typeof statusLabels] || status}</span>;
  };

  const statusOptions = [
    { value: "All Status", label: "Semua Status" },
    { value: "Active", label: "Aktif" },
    { value: "Inactive", label: "Belum Aktif" },
    { value: "Expired", label: "Kedaluwarsa" },
  ];

  const columns = [
    {
      key: "title",
      label: "Judul",
      className: "text-xs font-medium text-black",
      render: (value: string, item: any) => (
        <div>
          <div className="max-w-xs truncate">{value}</div>
          <div className="sm:hidden text-gray-500 text-xs mt-1">{formatDate(item.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Tanggal Dibuat",
      className: "whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell",
      render: (value: any) => formatDate(value),
    },
    {
      key: "priority",
      label: "Prioritas",
      className: "whitespace-nowrap text-xs text-gray-600 hidden md:table-cell",
      render: (value: string) => {
        const priorityClasses = {
          normal: "bg-blue-100 text-blue-800",
          penting: "bg-orange-100 text-orange-800",
          urgent: "bg-red-100 text-red-800",
        };

        const priorityLabels = {
          normal: "Normal",
          penting: "Penting",
          urgent: "Urgent",
        };

        return (
          <span className={`app-button-small font-medium smooth-transition ${priorityClasses[value as keyof typeof priorityClasses] || "bg-gray-100 text-gray-800"}`}>{priorityLabels[value as keyof typeof priorityLabels] || value}</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "whitespace-nowrap hidden sm:table-cell",
      render: (value: string) => getStatusBadge(value),
    },
  ];

  const headerActions = (
    <Link href="/dashboard/announcement/create">
      <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap smooth-transition hover-lift">
        <FiPlus size={14} />
        Tambah Pengumuman
      </ActionButton>
    </Link>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Pengumuman" subtitle="Kelola dan atur pengumuman desa" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Pengumuman"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari pengumuman..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            mounted={mounted}
          />

          <DataTableWithStates
            columns={columns}
            data={announcements}
            editRoute={handleEdit}
            onDelete={handleDelete}
            mounted={mounted}
            loading={loading && announcements.length === 0}
            error={error}
            onRetry={() => {
              if (isSearching) {
                searchAnnouncementsPaginated(searchTerm);
              } else {
                const getStatusFilter = () => {
                  if (statusFilter === "Active") return "active";
                  if (statusFilter === "Inactive") return "inactive";
                  if (statusFilter === "Expired") return "expired";
                  return "all";
                };
                fetchAnnouncementsPaginated(currentPage, itemsPerPage, getStatusFilter());
              }
            }}
            emptyMessage={searchTerm ? "Tidak ditemukan pengumuman yang sesuai" : "Belum ada pengumuman"}
          />


          {!isSearching && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalItems} loading={loading} onItemsPerPageChange={handleItemsPerPageChange} />
          )}
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <img
                src="/logo-ub.png"
                alt="Logo UB"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-filkom.png"
                alt="Logo FILKOM"
                className="w-auto h-5 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-diktisaintek.png"
                alt="Logo Diktisaintek Berdampak"
                className="w-auto h-6 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-mmd.png"
                alt="Logo MMD"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-black font-medium text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh Tim MMD FILKOM 49 Tahun 2025</p>
              <p className="text-black/70 text-[10px] md:text-[10px] leading-relaxed smooth-transition">Program Mahasiswa Membangun Desa, Fakultas Ilmu Komputer, Universitas Brawijaya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;

