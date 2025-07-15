"use client";

import { useState, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { GalleryImage, CreateGalleryImageData, UpdateGalleryImageData, getGalleryImages, getGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImageById, getActiveGalleryImages } from "@/lib/galleryService";

export const useGalleryImages = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = useCallback(
    async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all", reset: boolean = true) => {
      setLoading(true);
      setError(null);

      try {
        const { images: newImages, lastVisible: newLastVisible } = await getGalleryImages(
          pageSize,
          reset ? undefined : lastVisible || undefined,
          statusFilter
        );

        if (reset) {
          setImages(newImages);
          setLastVisible(newLastVisible);
        } else {
          setImages((prev) => [...prev, ...newImages]);
          setLastVisible(newLastVisible);
        }

        setHasMore(newImages.length === pageSize);
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch gallery images");
        setImages([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [lastVisible]
  );

  const loadMore = useCallback(
    async (pageSize: number = 10, statusFilter: "all" | "active" | "inactive" = "all") => {
      if (!hasMore || loading) return;
      await fetchImages(pageSize, statusFilter, false);
    },
    [hasMore, loading, fetchImages]
  );

  const searchImages = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        clearSearch();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { images: allImages } = await getGalleryImages(1000);
        const filtered = allImages.filter(
          (image) =>
            image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (image.category && image.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        setImages(filtered);
        setLastVisible(null);
        setHasMore(false);
      } catch (err) {
        console.error("Gallery search error:", err);
        setError(err instanceof Error ? err.message : "Failed to search gallery images");
        setImages([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setImages([]);
    setLastVisible(null);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    images,
    loading,
    error,
    hasMore,
    fetchImages,
    loadMore,
    searchImages,
    clearSearch,
  };
};

export const useGalleryImage = (id?: string) => {
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const imageData = await getGalleryImageById(id);
        setImage(imageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch gallery image");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  return { image, loading, error };
};

export const useGalleryImageActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateGalleryImageData): Promise<GalleryImage | null> => {
    setLoading(true);
    setError(null);

    try {
      const image = await createGalleryImage(data);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create gallery image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateGalleryImageData): Promise<GalleryImage | null> => {
    setLoading(true);
    setError(null);

    try {
      const image = await updateGalleryImage(id, data);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update gallery image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteGalleryImageById(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete gallery image");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError,
  };
};

export const useActiveGalleryImages = (limit?: number) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching active gallery images...");
      const activeImages = await getActiveGalleryImages(limit);
      console.log("Active gallery images fetched:", activeImages.length, activeImages);
      setImages(activeImages);
    } catch (err) {
      console.error("Error fetching active gallery images:", err);
      if (err instanceof Error && err.message.includes("collection")) {
        setImages([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch active gallery images");
        setImages([]);
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActiveImages();
  }, [fetchActiveImages]);

  const refetch = useCallback(() => {
    fetchActiveImages();
  }, [fetchActiveImages]);

  return {
    images,
    loading,
    error,
    refetch,
  };
};

