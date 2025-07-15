"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import ArticleForm from "@/component/dashboard/ArticleForm";
import { useArticleActions } from "@/hooks/useArticles";
import { useAuth } from "@/contexts/AuthContext";

const CreateArticlePage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useArticleActions();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    status: "draft" as "draft" | "published",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!user || !profile) {
      alert("Anda harus login untuk membuat artikel");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan konten berita harus diisi");
      return;
    }

    if (!formData.image) {
      alert("Gambar berita harus diupload");
      return;
    }

    if (storageError) {
      alert("Tidak dapat menyimpan artikel karena storage penuh. Silakan kosongkan storage terlebih dahulu.");
      return;
    }

    const result = await create({
      title: formData.title.trim(),
      content: formData.content.trim(),
      image: formData.image,
      authorId: user.uid,
      authorName: profile.name,
      status: formData.status,
    });

    if (result) {
      setSuccess("Artikel berhasil dibuat!");
      setTimeout(() => {
        router.push("/dashboard/article");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/article");
  };

  const headerActions = (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Tambah Berita" subtitle="Buat artikel berita baru untuk desa" actions={headerActions} />

      <div className="app-content">
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default CreateArticlePage;

