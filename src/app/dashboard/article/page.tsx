"use client";

import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import DataTable from "@/component/common/DataTable";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner, ErrorState, EmptyState, DataTableWithStates } from "@/component/common/LoadingStates";
import { useArticlesPagination, useArticleActions } from "@/hooks/useArticles";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const ArticlePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    articles, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage, 
    fetchArticlesPaginated, 
    searchArticlesPaginated,
    goToPage
  } = useArticlesPagination();

  const { remove, loading: deleteLoading } = useArticleActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      const statusFilterValue = statusFilter === "All Status" ? "all" : (statusFilter as "published" | "draft");
      fetchArticlesPaginated(1, 10, statusFilterValue);
    }
  }, [statusFilter, mounted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchArticlesPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted) {
          const statusFilterValue = statusFilter === "All Status" ? "all" : (statusFilter as "published" | "draft");
          fetchArticlesPaginated(1, 10, statusFilterValue);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted]);

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const success = await remove(String(id));
      if (success) {
        if (isSearching) {
          searchArticlesPaginated(searchTerm);
        } else {
          const statusFilterValue = statusFilter === "All Status" ? "all" : (statusFilter as "published" | "draft");
          fetchArticlesPaginated(currentPage, 10, statusFilterValue);
        }
      }
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/article/update?id=${id}`);
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const statusFilterValue = statusFilter === "All Status" ? "all" : (statusFilter as "published" | "draft");
      fetchArticlesPaginated(page, 10, statusFilterValue);
    }
    goToPage(page);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return "-";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return <span className={`app-button-small ${config.bg} ${config.text} font-medium smooth-transition`}>{config.label}</span>;
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      className: "text-xs font-medium text-black",
      render: (value: string, item: any) => (
        <div>
          <div className="max-w-xs truncate font-medium">{value}</div>
          <div className="text-gray-500 text-xs mt-1 max-w-xs truncate">{item.excerpt || "Tidak ada excerpt"}</div>
          <div className="sm:hidden text-gray-500 text-xs mt-1">{formatDate(item.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "authorName",
      label: "Author",
      className: "whitespace-nowrap text-xs text-gray-600 hidden md:table-cell",
    },
    {
      key: "createdAt",
      label: "Date Created",
      className: "whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell",
      render: (value: any) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      className: "whitespace-nowrap hidden sm:table-cell",
      render: (value: string) => getStatusBadge(value),
    },
  ];

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ];

  const headerActions = (
    <Link href="/dashboard/article/create">
      <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap">
        <FiPlus size={14} />
        Tambah Berita
      </ActionButton>
    </Link>
  );

  if (error) {
    return (
      <>
        <PageHeader title="Kelola Berita" subtitle="Kelola dan atur berita desa" actions={headerActions} mounted={mounted} />
        <div className="app-content">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Kelola Berita" subtitle="Kelola dan atur berita desa" actions={headerActions} mounted={mounted} />


      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Berita"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari berita..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            mounted={mounted}
          />

          <DataTableWithStates 
            columns={columns} 
            data={articles} 
            editRoute={handleEdit} 
            onDelete={handleDelete} 
            mounted={mounted}
            loading={loading && articles.length === 0}
            error={error}
            onRetry={() => {
              if (isSearching) {
                searchArticlesPaginated(searchTerm);
              } else {
                const statusFilterValue = statusFilter === "All Status" ? "all" : (statusFilter as "published" | "draft");
                fetchArticlesPaginated(currentPage, 10, statusFilterValue);
              }
            }}
            emptyMessage={searchTerm ? "Tidak ada artikel yang ditemukan dengan kata kunci tersebut." : "Belum ada artikel yang dibuat."}
          />

          {!isSearching && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default ArticlePage;

