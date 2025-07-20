﻿"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    status: "draft" as "draft" | "published",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="flex flex-col min-h-full">
      <PageHeader title="Tambah Berita" subtitle="Buat artikel berita baru untuk desa" actions={headerActions} mounted={mounted} />
      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {storageError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{storageError}</div>}

        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm formData={formData} onChange={handleFormChange} onStorageError={handleStorageError} loading={loading} />
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
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
export default CreateArticlePage;
