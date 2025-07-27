"use client";

import { useState, useEffect } from "react";
import { getAllUsers, getUsersByRole, updateUserRole, deleteUser, getUserStats, getUsersWithPagination, searchUsers, UserListItem } from "@/lib/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch,
  };
};

export const useUsersPagination = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsersPaginated = async (page: number = 1, pageSize: number = 10, roleFilter: "all" | "admin" | "pending" = "all") => {
    try {
      setLoading(true);
      setError(null);

      const { users: newUsers, totalPages: newTotalPages, totalItems: newTotalItems } = await getUsersWithPagination(page, pageSize, roleFilter);

      setUsers(newUsers);
      setCurrentPage(page);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
      setItemsPerPage(pageSize);
    } catch (err) {
      console.error("Error fetching users with pagination:", err);

      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);

      setUsers([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const searchUsersPaginated = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchUsersPaginated(1, itemsPerPage);
        return;
      }

      const searchResults = await searchUsers(searchTerm);
      setUsers(searchResults);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(searchResults.length);
    } catch (err) {
      console.error("Error searching users:", err);

      const errorMessage = err instanceof Error ? err.message : "Failed to search users";
      setError(errorMessage);

      setUsers([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const changeItemsPerPage = async (newItemsPerPage: number, currentRoleFilter: "all" | "admin" | "pending" = "all") => {
    setItemsPerPage(newItemsPerPage);
    await fetchUsersPaginated(1, newItemsPerPage, currentRoleFilter);
  };

  return {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    fetchUsersPaginated,
    searchUsersPaginated,
    goToPage,
    changeItemsPerPage,
    setError,
  };
};

export const useUsersByRole = (role: "admin" | "pending") => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await getUsersByRole(role);
      setUsers(usersList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch,
  };
};

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRole = async (userId: string, newRole: "admin" | "pending") => {
    try {
      setLoading(true);
      setError(null);
      await updateUserRole(userId, newRole);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    updateRole,
    removeUser,
    loading,
    error,
    clearError,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};

