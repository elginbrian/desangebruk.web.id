"use client";

import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import ArticleForm from "@/component/dashboard/ArticleForm";

const CreateArticlePage = () => {
  const headerActions = (
    <>
      <ActionButton variant="secondary">Batal</ActionButton>
      <ActionButton variant="primary">Simpan</ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Tambah Berita" subtitle="Buat artikel berita baru untuk desa" actions={headerActions} />

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <ArticleForm />
        </div>
      </div>
    </>
  );
};

export default CreateArticlePage;
