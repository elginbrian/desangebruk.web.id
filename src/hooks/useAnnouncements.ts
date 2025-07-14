"use client";

import { useState, useEffect } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
  Announcement,
  CreateAnnouncementData,
  UpdateAnnouncementData,
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementBySlug,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  searchAnnouncements,
} from "@/lib/announcementService";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnnouncements = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" | "expired" = "all", reset: boolean = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAnnouncements(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setAnnouncements(result.announcements);
      } else {
        setAnnouncements((prev) => [...prev, ...result.announcements]);
      }

      setLastVisible(result.lastVisible);
      setHasMore(result.announcements.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" | "expired" = "all") => {
    if (!hasMore || loading) return;
    await fetchAnnouncements(pageSize, statusFilter, false);
  };

  const searchAnnouncementsList = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchAnnouncements(searchTerm);
      setAnnouncements(results);
      setLastVisible(null);
      setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search announcements");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setAnnouncements([]);
    setLastVisible(null);
    setHasMore(true);
    setError(null);
  };

  return {
    announcements,
    loading,
    error,
    hasMore,
    fetchAnnouncements,
    loadMore,
    searchAnnouncementsList,
    clearSearch,
  };
};

export const useAnnouncement = (id?: string) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAnnouncementById(id);
        setAnnouncement(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  return { announcement, loading, error };
};

export const useAnnouncementBySlug = (slug?: string) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAnnouncementBySlug(slug);
        setAnnouncement(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  return { announcement, loading, error };
};

export const useAnnouncementActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateAnnouncementData): Promise<Announcement | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createAnnouncement(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create announcement");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateAnnouncementData): Promise<Announcement | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateAnnouncement(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update announcement");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteAnnouncement(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete announcement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,
  };
};

export const useActiveAnnouncements = (limit?: number) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnnouncements = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const results = await getActiveAnnouncements(limit);
      setAnnouncements(results);
      setRetryCount(0);

      if (results.length === 0) {
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch announcements";
      if (errorMessage.includes("index") || errorMessage.includes("Index")) {
        setError("Sistem sedang diperbarui. Silakan coba lagi dalam beberapa saat.");
      } else {
        setError("Gagal memuat pengumuman. Silakan coba lagi.");
      }

      if (announcements.length === 0) {
        setAnnouncements([]);
      }

      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchAnnouncements(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchAnnouncements();
  };

  return {
    announcements,
    loading,
    error,
    refetch,
    retryCount,
  };
};

