import React from "react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSelect from "../common/FormSelect";

interface AnnouncementFormProps {
  formData?: {
    title?: string;
    content?: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
  };
  onChange?: (field: string, value: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const AnnouncementForm = ({ formData = {}, onChange, isEditing = false, loading = false }: AnnouncementFormProps) => {
  const priorityOptions = [
    { value: "normal", label: "Normal" },
    { value: "penting", label: "Penting" },
    { value: "urgent", label: "Urgent" },
  ];

  const handleChange = (field: string, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <form className="space-y-4">
      <FormInput label="Judul Pengumuman" name="title" value={formData.title || ""} placeholder="Masukkan judul pengumuman..." onChange={(e) => handleChange("title", e.target.value)} disabled={loading} required />

      <FormTextarea label="Isi Pengumuman" name="content" value={formData.content || ""} placeholder="Tulis isi pengumuman di sini..." rows={6} onChange={(e) => handleChange("content", e.target.value)} disabled={loading} required />

      <div className="grid grid-cols-2 gap-3">
        <FormInput label="Tanggal Mulai" name="startDate" type="date" value={formData.startDate || ""} onChange={(e) => handleChange("startDate", e.target.value)} disabled={loading} required />
        <FormInput label="Tanggal Berakhir" name="endDate" type="date" value={formData.endDate || ""} onChange={(e) => handleChange("endDate", e.target.value)} disabled={loading} required />
      </div>

      <FormSelect label="Tingkat Prioritas" name="priority" value={formData.priority || "normal"} options={priorityOptions} onChange={(e) => handleChange("priority", e.target.value)} disabled={loading} />
    </form>
  );
};

export default AnnouncementForm;
