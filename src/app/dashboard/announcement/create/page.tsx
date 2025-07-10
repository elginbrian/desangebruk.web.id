import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import AnnouncementForm from "@/component/dashboard/AnnouncementForm";

const CreateAnnouncementPage = () => {
  const headerActions = (
    <>
      <ActionButton variant="secondary">Batal</ActionButton>
      <ActionButton variant="primary">Simpan</ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Tambah Pengumuman" subtitle="Buat pengumuman baru untuk desa" actions={headerActions} />

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <AnnouncementForm />
        </div>
      </div>
    </>
  );
};

export default CreateAnnouncementPage;
