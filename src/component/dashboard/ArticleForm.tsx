import React, { useState, useRef } from "react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSelect from "../common/FormSelect";
import { FiUpload, FiX, FiImage, FiAlertTriangle } from "react-icons/fi";
import { useStorageValidation } from "@/hooks/useStorage";

interface ArticleFormProps {
  formData?: {
    title?: string;
    content?: string;
    imageUrl?: string;
    status?: "draft" | "published";
  };
  onChange?: (field: string, value: string | File) => void;
  onStorageError?: (message: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const ArticleForm = ({ formData = {}, onChange, onStorageError, isEditing = false, loading = false }: ArticleFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(formData.imageUrl || null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateUpload, checkStorageStatus } = useStorageValidation();

  const handleChange = (field: string, value: string | File) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleImageChange = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const validation = await validateUpload(file);

      if (!validation.canUpload) {
        setStorageError(validation.message || "Storage penuh!");
        if (onStorageError) {
          onStorageError(validation.message || "Storage penuh!");
        }
        return;
      }

      setStorageError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleChange("image", file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setStorageError(null);
    handleChange("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  return (
    <div className="space-y-6">
      <FormInput label="Judul Berita" name="title" value={formData.title || ""} placeholder="Masukkan judul berita..." onChange={(e) => handleChange("title", e.target.value)} disabled={loading} required />

      <FormTextarea label="Konten Berita" name="content" value={formData.content || ""} placeholder="Tulis konten berita di sini..." rows={8} onChange={(e) => handleChange("content", e.target.value)} disabled={loading} required />

      <FormSelect label="Status" name="status" value={formData.status || "draft"} options={statusOptions} onChange={(e) => handleChange("status", e.target.value)} disabled={loading} required />

      <div>
        <label className="block text-xs font-medium text-black mb-2">Gambar Berita {!isEditing && <span className="text-red-500">*</span>}</label>


        {storageError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">Storage Penuh!</p>
              <p className="text-xs text-red-700">{storageError}</p>
            </div>
          </div>
        )}

        {isEditing && formData.imageUrl && !previewUrl && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2">Gambar saat ini:</p>
            <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
              <img src={formData.imageUrl} alt="Current image" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">Gambar sebelumnya</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload gambar baru di bawah untuk mengganti gambar ini</p>
          </div>
        )}

        {previewUrl ? (
          <div className="relative">
            <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={removeImage} disabled={loading} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50">
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Klik tombol X untuk menghapus gambar, atau drag & drop gambar baru untuk mengganti</p>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive ? "border-[#1B3A6D] bg-[#1B3A6D]/5" : "border-gray-300 hover:border-[#1B3A6D] hover:bg-gray-50"} ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center">
              <FiImage className="text-gray-400 mb-4" size={48} />
              <div className="flex items-center gap-2 mb-2">
                <FiUpload size={16} />
                <span className="text-gray-600 font-medium">{dragActive ? "Lepaskan gambar di sini" : "Drag & drop gambar atau klik untuk upload"}</span>
              </div>
              <p className="text-xs text-gray-500">{isEditing ? "Upload gambar baru untuk mengganti yang lama" : "Mendukung format: JPG, PNG, GIF (Max: 5MB)"}</p>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={loading} />
      </div>
    </div>
  );
};

export default ArticleForm;

