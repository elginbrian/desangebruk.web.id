"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiImage } from "react-icons/fi";
import { useGalleryImages, useGalleryImageActions } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/component/common/PageHeader";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import DataTable from "@/component/common/DataTable";
import ActionButton from "@/component/common/ActionButton";
import { LoadingSpinner, ErrorState } from "@/component/common/LoadingStates";

const GalleryPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);

  const { images, loading, error, hasMore, fetchImages, loadMore, searchImages, clearSearch } = useGalleryImages();
  const { remove, loading: deleteLoading } = useGalleryImageActions();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchImages(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (mounted && user) {
      clearSearch();
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };
      fetchImages(10, getStatusFilter()).catch((err) => {
        console.error("Error fetching images:", err);
      });
    }
  }, [searchTerm, mounted, user, statusFilter]);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      return;
    }

    const success = await remove(id as string);
    if (success) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };

      fetchImages(10, getStatusFilter());
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/gallery/update?id=${id}`);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const getStatusFilter = () => {
        if (statusFilter === "Active") return "active";
        if (statusFilter === "Inactive") return "inactive";
        return "all";
      };

      loadMore(10, getStatusFilter());
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiEye className="mr-1" size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FiEyeOff className="mr-1" size={12} />
        Inactive
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      umum: "bg-blue-100 text-blue-800",
      kegiatan: "bg-green-100 text-green-800",
      fasilitas: "bg-purple-100 text-purple-800",
      wisata: "bg-yellow-100 text-yellow-800",
      pembangunan: "bg-orange-100 text-orange-800",
    };

    const colorClass = categoryColors[category] || "bg-gray-100 text-gray-800";

    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>;
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Gambar",
      className: "w-24",
      render: (value: string) => (
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={value || "/kantor_desa.jpg"}
            alt="Gallery"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/kantor_desa.jpg";
            }}
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Judul",
      className: "font-medium text-gray-900",
    },
    {
      key: "category",
      label: "Kategori",
      render: (value: string) => getCategoryBadge(value),
    },
    {
      key: "order",
      label: "Urutan",
      className: "text-center",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      key: "createdAt",
      label: "Dibuat",
      render: (value: any) => <span className="text-sm text-gray-500">{formatDate(value)}</span>,
    },
  ];

  const headerActions = (
    <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap" onClick={() => router.push("/dashboard/gallery/create")} disabled={loading}>
      <FiPlus size={16} />
      Tambah Gambar
    </ActionButton>
  );

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  if (loading && images.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <PageHeader title="Kelola Galeri" subtitle="Kelola gambar-gambar yang ditampilkan di galeri website" actions={headerActions} mounted={mounted} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <PageHeader title="Kelola Galeri" subtitle="Kelola gambar-gambar yang ditampilkan di galeri website" actions={headerActions} mounted={mounted} />
        <div className="flex-1 flex items-center justify-center">
          <ErrorState message={error} onRetry={() => fetchImages()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Kelola Galeri" subtitle="Kelola gambar-gambar yang ditampilkan di galeri website" actions={headerActions} mounted={mounted} />

      <div className="flex-1 p-6 space-y-6">
        <SearchAndFilterBar
          title="Daftar Gambar Galeri"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari berdasarkan judul, deskripsi, atau kategori..."
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptions}
          mounted={mounted}
        />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={images} editRoute={handleEdit} onDelete={handleDelete} mounted={mounted} />

          {hasMore && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <button onClick={handleLoadMore} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Memuat..." : "Muat Lebih Banyak"}
              </button>
            </div>
          )}

          {images.length === 0 && !loading && (
            <div className="px-6 py-12 text-center">
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada gambar</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan gambar pertama Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
