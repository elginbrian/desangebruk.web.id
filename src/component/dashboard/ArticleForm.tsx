import React from "react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";

interface ArticleFormProps {
  formData?: {
    title?: string;
    content?: string;
    image?: string;
  };
  onChange?: (field: string, value: string) => void;
  isEditing?: boolean;
}

const ArticleForm = ({ formData = {}, onChange, isEditing = false }: ArticleFormProps) => {
  const handleChange = (field: string, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <form className="space-y-4">
      <FormInput label="Judul Berita" name="title" defaultValue={formData.title} placeholder="Masukkan judul berita..." onChange={(e) => handleChange("title", e.target.value)} />

      <FormTextarea label="Konten Berita" name="content" defaultValue={formData.content} placeholder="Tulis konten berita di sini..." rows={8} onChange={(e) => handleChange("content", e.target.value)} />

      <div>
        <label className="block text-xs font-medium text-black mb-2">Gambar</label>
        <div className="border-2 border-dashed border-gray-300 app-border-radius p-4 text-center">
          <p className="text-gray-600 text-xs">{isEditing ? "Drag & drop gambar baru atau klik untuk upload" : "Drag & drop gambar atau klik untuk upload"}</p>
          <input type="file" className="hidden" accept="image/*" />
          {isEditing && formData.image && <p className="text-xs text-gray-500 mt-2">Gambar saat ini: {formData.image}</p>}
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;
