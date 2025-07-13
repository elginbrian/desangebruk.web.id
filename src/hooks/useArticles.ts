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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const publishedArticles = await getPublishedArticles(limit);
      setArticles(publishedArticles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch published articles";
      setError(errorMessage);
      // Set empty array on error so UI can show fallback content
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedArticles();
  }, [limit]);

  return {
    articles,
    loading,
    error,
    refetch: fetchPublishedArticles,
  };
};
