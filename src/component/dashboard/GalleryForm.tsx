import React, { useState, useRef } from "react";
import { FiUpload, FiX, FiImage, FiAlertTriangle } from "react-icons/fi";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import FormSelect from "@/component/common/FormSelect";
import { useStorageValidation } from "@/hooks/useStorage";

interface GalleryFormProps {
  formData?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: string;
    isActive?: boolean;
    order?: number;
  };
  onChange?: (field: string, value: string | File | boolean | number) => void;
  onStorageError?: (message: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const GalleryForm = ({ formData = {}, onChange, onStorageError, isEditing = false, loading = false }: GalleryFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(formData.imageUrl || null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateUpload, checkStorageStatus } = useStorageValidation();

  const categoryOptions = [
    { value: "umum", label: "Umum" },
    { value: "kegiatan", label: "Kegiatan" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "wisata", label: "Wisata" },
    { value: "pembangunan", label: "Pembangunan" },
  ];

  const handleChange = (field: string, value: string | File | boolean | number) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleImageChange = async (file: File) => {
    const validation = await validateUpload(file);
    
    if (!validation.canUpload) {
      setStorageError(validation.message || "Storage penuh!");
      if (onStorageError) {
        onStorageError(validation.message || "Storage penuh!");
      }
      return;
    }

    setStorageError(null);

    handleChange("image", file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setStorageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleChange("image", "" as any);
  };

  return (
    <div className="space-y-6">

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar {!isEditing && <span className="text-red-500">*</span>}
        </label>


        {storageError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <FiAlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">Storage Penuh!</p>
              <p className="text-xs text-red-700">{storageError}</p>
            </div>
          </div>
        )}
        
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
            ${loading ? "pointer-events-none opacity-50" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FiImage className="text-gray-400" size={48} />
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop gambar di sini, atau{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                    disabled={loading}
                  >
                    pilih file
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Format yang didukung: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />
        </div>
      </div>


      <FormInput
        label="Judul"
        id="title"
        name="title"
        value={formData.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Masukkan judul gambar..."
        required
        disabled={loading}
      />


      <FormTextarea
        label="Deskripsi"
        id="description"
        name="description"
        value={formData.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Masukkan deskripsi gambar..."
        rows={4}
        disabled={loading}
      />


      <FormSelect
        label="Kategori"
        id="category"
        name="category"
        value={formData.category || "umum"}
        onChange={(e) => handleChange("category", e.target.value)}
        options={categoryOptions}
        disabled={loading}
      />


      <FormInput
        label="Urutan"
        id="order"
        name="order"
        type="text"
        value={formData.order?.toString() || "0"}
        onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
        placeholder="Masukkan urutan gambar..."
        disabled={loading}
      />


      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive !== undefined ? formData.isActive : true}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Aktif (tampilkan di galeri)
          </label>
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;


