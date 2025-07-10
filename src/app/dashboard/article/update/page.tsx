"use client";

import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import ArticleForm from "@/component/dashboard/ArticleForm";

const UpdateArticlePage = () => {
  const formData = {
    title: "Pembangunan Jalan Desa Tahap II",
    content: "Pembangunan jalan desa tahap II akan segera dimulai pada bulan depan...",
    image: "jalan_desa.jpg",
  };

  const headerActions = (
    <>
      <ActionButton variant="secondary">Batal</ActionButton>
      <ActionButton variant="primary">Update</ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Edit Berita" subtitle="Edit artikel berita yang sudah ada" actions={headerActions} />

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm formData={formData} isEditing={true} />
        </div>
      </div>
    </>
  );
};

export default UpdateArticlePage;
