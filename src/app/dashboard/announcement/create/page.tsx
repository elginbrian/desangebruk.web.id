"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import AnnouncementForm from "@/component/dashboard/AnnouncementForm";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncementActions } from "@/hooks/useAnnouncements";

const CreateAnnouncementPage = () => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { create, loading, error } = useAnnouncementActions();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    priority: "normal" as "normal" | "penting" | "urgent",
  });

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (success) {
      setSuccess(null);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) {
      alert("Anda harus login untuk membuat pengumuman");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Judul dan isi pengumuman harus diisi");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Tanggal mulai dan berakhir harus diisi");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert("Tanggal mulai tidak boleh lebih besar dari tanggal berakhir");
      return;
    }

    const announcementData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
      authorId: user.uid,
      authorName: profile.name,
    };

    const result = await create(announcementData);

    if (result) {
      setSuccess("Pengumuman berhasil dibuat!");
      setTimeout(() => {
        router.push("/dashboard/announcement");
      }, 1500);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/announcement");
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
      <PageHeader title="Tambah Pengumuman" subtitle="Buat pengumuman baru untuk desa" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100">
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">{error}</div>}

          {success && <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">{success}</div>}

          <AnnouncementForm formData={formData} onChange={handleFormChange} isEditing={false} />
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

export default CreateAnnouncementPage;
