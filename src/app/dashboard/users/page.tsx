"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiUser } from "react-icons/fi";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import Pagination from "@/component/common/Pagination";
import { useUsersPagination, useUserActions } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const UsersPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Status");
  const [isSearching, setIsSearching] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { users, loading, error, currentPage, totalPages, totalItems, itemsPerPage, fetchUsersPaginated, searchUsersPaginated, goToPage, changeItemsPerPage } = useUsersPagination();
  const { updateRole, removeUser, loading: actionLoading, error: actionError, clearError } = useUserActions();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      const getRoleFilter = () => {
        if (roleFilter === "admin") return "admin";
        if (roleFilter === "pending") return "pending";
        return "all";
      };
      fetchUsersPaginated(1, itemsPerPage, getRoleFilter());
    }
  }, [roleFilter, mounted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchUsersPaginated(searchTerm);
      } else {
        setIsSearching(false);
        if (mounted) {
          const getRoleFilter = () => {
            if (roleFilter === "admin") return "admin";
            if (roleFilter === "pending") return "pending";
            return "all";
          };
          fetchUsersPaginated(1, itemsPerPage, getRoleFilter());
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, mounted]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleUpdateRole = async (userId: string, newRole: "admin" | "pending") => {
    const success = await updateRole(userId, newRole);
    if (success) {
      setSuccess("Role pengguna berhasil diperbarui");
      if (isSearching) {
        searchUsersPaginated(searchTerm);
      } else {
        const getRoleFilter = () => {
          if (roleFilter === "admin") return "admin";
          if (roleFilter === "pending") return "pending";
          return "all";
        };
        fetchUsersPaginated(currentPage, itemsPerPage, getRoleFilter());
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const success = await removeUser(userId);
      if (success) {
        setSuccess("Pengguna berhasil dihapus");
        if (isSearching) {
          searchUsersPaginated(searchTerm);
        } else {
          const getRoleFilter = () => {
            if (roleFilter === "admin") return "admin";
            if (roleFilter === "pending") return "pending";
            return "all";
          };
          fetchUsersPaginated(currentPage, itemsPerPage, getRoleFilter());
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (!isSearching) {
      const getRoleFilter = () => {
        if (roleFilter === "admin") return "admin";
        if (roleFilter === "pending") return "pending";
        return "all";
      };
      fetchUsersPaginated(page, itemsPerPage, getRoleFilter());
    }
    goToPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    const getRoleFilter = () => {
      if (roleFilter === "admin") return "admin";
      if (roleFilter === "pending") return "pending";
      return "all";
    };
    changeItemsPerPage(newItemsPerPage, getRoleFilter());
  };

  const handleRefresh = () => {
    if (isSearching) {
      searchUsersPaginated(searchTerm);
    } else {
      const getRoleFilter = () => {
        if (roleFilter === "admin") return "admin";
        if (roleFilter === "pending") return "pending";
        return "all";
      };
      fetchUsersPaginated(currentPage, itemsPerPage, getRoleFilter());
    }
    clearError();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    if (typeof window === "undefined") return "-";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return "-";
    }
  };

  const getRoleColor = (role: string) => {
    if (!role) return "bg-gray-100 text-gray-800";

    switch (role) {
      case "admin":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    if (!role) return "Tidak Diketahui";

    switch (role) {
      case "admin":
        return "Administrator";
      case "pending":
        return "Menunggu Persetujuan";
      default:
        return "Tidak Diketahui";
    }
  };

  const columns = [
    {
      key: "name",
      label: "Pengguna",
      sortable: false,
      render: (name: any, user: any) => {
        if (!user) {
          return <span className="text-sm text-gray-400">Data kosong</span>;
        }

        return (
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
              <div className="w-10 h-10 bg-[#1B3A6D] rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user?.name || "Tidak ada nama"}
                {currentUser?.uid === (user?.id || user?.uid) && <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Anda</span>}
              </div>
              <div className="text-sm text-gray-500">{user?.email || "Tidak ada email"}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (role: any, user: any) => <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role)}`}>{getRoleLabel(user?.role)}</span>,
    },
    {
      key: "createdAt",
      label: "Terdaftar",
      sortable: true,
      render: (createdAt: any, user: any) => (
        <div className="flex items-center text-sm text-gray-900">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
          {formatDate(user?.createdAt)}
        </div>
      ),
    },
    {
      key: "roleActions",
      label: "Role Management",
      sortable: false,
      render: (roleActions: any, user: any) => {
        if (!user || (!user.id && !user.uid)) {
          return <span className="text-sm text-gray-400">-</span>;
        }

        const userId = user.id || user.uid;
        const isCurrentUser = currentUser?.uid === userId;

        if (isCurrentUser) {
          return <span className="text-sm text-gray-400">Current User</span>;
        }

        return (
          <select
            value={user?.role || "pending"}
            onChange={(e) => handleUpdateRole(userId, e.target.value as "admin" | "pending")}
            disabled={actionLoading}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent disabled:opacity-50"
          >
            <option value="pending">Menunggu Persetujuan</option>
            <option value="admin">Administrator</option>
          </select>
        );
      },
    },
  ];

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "pending", label: "Menunggu Persetujuan" },
    { value: "admin", label: "Administrator" },
  ];

  const headerActions = (
    <ActionButton onClick={() => (window.location.href = "/dashboard/profile")} disabled={loading} className="flex items-center gap-2 whitespace-nowrap">
      <FiUser size={14} />
      Profil Saya
    </ActionButton>
  );

  if (error) {
    return (
      <>
        <PageHeader title="Kelola Akun" subtitle="Kelola pengguna dan atur hak akses ke dashboard" actions={headerActions} mounted={mounted} />
        <div className="app-content">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Akun" subtitle="Kelola pengguna dan atur hak akses ke dashboard" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {mounted && success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md smooth-transition">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {mounted && actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{actionError}</p>
          </div>
        )}

        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <SearchAndFilterBar
            title="Pengguna"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari nama atau email..."
            statusFilter={roleFilter}
            onStatusFilterChange={setRoleFilter}
            statusOptions={statusOptions}
            mounted={mounted}
          />

          <DataTableWithStates
            columns={columns}
            data={users}
            onDelete={(userId) => handleDeleteUser(String(userId))}
            mounted={mounted}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
            emptyMessage={searchTerm ? "Tidak ada pengguna yang ditemukan dengan kata kunci tersebut." : "Belum ada pengguna yang terdaftar."}
          />


          {!isSearching && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalItems} loading={loading} onItemsPerPageChange={handleItemsPerPageChange} />
          )}
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition mt-8 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
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

export default UsersPage;

