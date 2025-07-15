"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import ArticleForm from "@/component/dashboard/ArticleForm";
import { useArticle, useArticleActions } from "@/hooks/useArticles";

const UpdateArticlePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");

  const { article, loading: fetchLoading, error: fetchError } = useArticle(articleId || undefined);
  const { update, loading: updateLoading, error: updateError } = useArticleActions();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    image: null as File | null,
    status: "draft" as "draft" | "published",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl || "",
        image: null,
        status: article.status,
      });
    }
  }, [article]);

  const handleFormChange = (field: string, value: string | File) => {
    if (field === "image" && value instanceof File) {
      setFormData((prev) => ({ ...prev, image: value }));
    } else if (typeof value === "string") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    
    if (storageError) {
      setStorageError(null);
    }
  };

  const handleStorageError = (message: string) => {
    setStorageError(message);
  };

  const handleUpdate = async () => {
    if (!articleId) {
      alert("ID artikel tidak ditemukan");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan konten berita harus diisi");
      return;
    }

    if (formData.image && storageError) {
      alert("Tidak dapat memperbarui artikel karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const updateData: any = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      status: formData.status,
    };

    if (formData.image) {
      updateData.image = formData.image;
    }

    const result = await update(articleId, updateData);

    if (result) {
      setSuccess("Artikel berhasil diperbarui!");
      setTimeout(() => {
        router.push("/dashboard/article");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/article");
  };

  if (!articleId) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">ID artikel tidak ditemukan. Silakan kembali ke halaman daftar artikel.</div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="app-content">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Memuat data artikel...</div>
        </div>
      </div>
    );
  }

  if (fetchError || !article) {
    return (
      <div className="app-content">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{fetchError || "Artikel tidak ditemukan"}</div>
      </div>
    );
  }

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={updateLoading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleUpdate} disabled={updateLoading}>
        {updateLoading ? "Memperbarui..." : "Update"}
      </ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Edit Berita" subtitle="Edit artikel berita yang sudah ada" actions={headerActions} />


      <div className="app-content">
        {updateError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{updateError}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} isEditing={true} loading={updateLoading} />
        </div>
      </div>
    </>
  );
};

export default UpdateArticlePage;


