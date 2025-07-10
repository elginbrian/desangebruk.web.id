import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import AnnouncementForm from "@/component/dashboard/AnnouncementForm";

const UpdateAnnouncementPage = () => {
  const formData = {
    title: "Jadwal Vaksinasi COVID-19",
    content: "Vaksinasi COVID-19 gelombang ketiga akan dilaksanakan di balai desa...",
    startDate: "2025-01-15",
    endDate: "2025-01-20",
    priority: "penting",
  };

  const headerActions = (
    <>
      <ActionButton variant="secondary">Batal</ActionButton>
      <ActionButton variant="primary">Update</ActionButton>
    </>
  );

  return (
    <>
      <PageHeader title="Edit Pengumuman" subtitle="Edit pengumuman yang sudah ada" actions={headerActions} />

      {/* Content */}
      <div className="app-content">
        <div className="bg-white app-card shadow-sm border border-gray-100">
          <AnnouncementForm formData={formData} isEditing={true} />
        </div>
      </div>
    </>
  );
};

export default UpdateAnnouncementPage;
