"use client";

import { useState, useEffect, useMemo } from "react";
import { FiUsers, FiRefreshCw, FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import SearchAndFilterBar from "@/component/common/SearchAndFilterBar";
import DataTable from "@/component/common/DataTable";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import { useUsers, useUserActions } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const UsersPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Status");
  const [success, setSuccess] = useState<string | null>(null);

  const { users, loading, error, refetch } = useUsers();
  const { updateRole, removeUser, loading: actionLoading, error: actionError, clearError } = useUserActions();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const filteredUsers = useMemo(() => {
    console.log("Raw users from hook:", users);

    return users.filter((user) => {
      if (!user) return false;

      const matchesSearch = (user?.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) || (user?.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === "All Status" || user?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleUpdateRole = async (userId: string, newRole: "admin" | "pending") => {
    const success = await updateRole(userId, newRole);
    if (success) {
      setSuccess("Role pengguna berhasil diperbarui");
      refetch();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const success = await removeUser(userId);
      if (success) {
        setSuccess("Pengguna berhasil dihapus");
        refetch();
      }
    }
  };

  const handleRefresh = () => {
    refetch();
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
        console.log("User object in render:", user);
        console.log("Name value:", name);

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
    <ActionButton onClick={handleRefresh} disabled={loading} className="flex items-center gap-2 whitespace-nowrap">
      <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} />
      Refresh
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
    <>
      <PageHeader title="Kelola Akun" subtitle="Kelola pengguna dan atur hak akses ke dashboard" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>

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
            data={filteredUsers}
            onDelete={(userId) => handleDeleteUser(String(userId))}
            mounted={mounted}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
            emptyMessage={
              users.length > 0 && filteredUsers.length === 0
                ? `Data pengguna ditemukan (${users.length}) tetapi tidak dapat ditampilkan. Periksa format data.`
                : searchTerm
                ? "Tidak ada pengguna yang ditemukan dengan kata kunci tersebut."
                : "Belum ada pengguna yang terdaftar."
            }
          />
        </div>
      </div>
    </>
  );
};

export default UsersPage;

