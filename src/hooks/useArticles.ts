"use client";

import { useState, useEffect } from "react";
import { Article, CreateArticleData, UpdateArticleData, createArticle, getArticles, getArticleById, updateArticle, deleteArticle, searchArticles, getPublishedArticles } from "@/lib/articleService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = async (pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all", reset: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const { articles: newArticles, lastVisible: newLastVisible } = await getArticles(pageSize, reset ? undefined : lastVisible || undefined, statusFilter);

      if (reset) {
        setArticles(newArticles);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
      }

      setLastVisible(newLastVisible);
      setHasMore(newArticles.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (pageSize: number = 10, statusFilter: "all" | "published" | "draft" = "all") => {
    if (!hasMore || loading) return;
    await fetchArticles(pageSize, statusFilter, false);
  };

  const searchArticlesList = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchArticles();
        return;
      }

      const searchResults = await searchArticles(searchTerm);
      setArticles(searchResults);
      setHasMore(false); // Search results don't support pagination
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search articles");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchArticles();
  };

  return {
    articles,
    loading,
    error,
    hasMore,
    fetchArticles,
    loadMore,
    searchArticlesList,
    clearSearch,
    setError,
  };
};

export const useArticle = (id?: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const articleData = await getArticleById(articleId);
      setArticle(articleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  return {
    article,
    loading,
    error,
    fetchArticle,
    setError,
  };
};

export const useArticleActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateArticleData): Promise<Article | null> => {
    try {
      setLoading(true);
      setError(null);

      const newArticle = await createArticle(data);
      return newArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create article");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateArticleData): Promise<Article | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedArticle = await updateArticle(id, data);
      return updatedArticle;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update article");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await deleteArticle(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    create,
    update,
    remove,
    clearError,
  };
};

export const usePublishedArticles = (limit?: number) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPublishedArticles = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true);
    }
    setError(null);

    try {
      const publishedArticles = await getPublishedArticles(limit);
      setArticles(publishedArticles);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch published articles";
      setError(errorMessage);

      // Set empty array on error so UI can show fallback content
      setArticles([]);

      // Auto retry up to 2 times with exponential backoff
      if (retryCount < 2 && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchPublishedArticles(true);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add small delay to prevent rapid requests
    const timer = setTimeout(() => {
      fetchPublishedArticles();
    }, 100);

    return () => clearTimeout(timer);
  }, [limit]);

  const refetch = () => {
    setRetryCount(0);
    fetchPublishedArticles();
  };

  return {
    articles,
    loading,
    error,
    refetch,
    retryCount,
  };
};
