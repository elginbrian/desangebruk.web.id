"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import FormInput from "@/component/common/FormInput";
import ActionButton from "@/component/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { profile, user } = useAuth();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    role: profile?.role || "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Save profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const headerActions = isEditing ? (
    <>
      <ActionButton variant="secondary" onClick={handleCancel}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave}>
        Simpan
      </ActionButton>
    </>
  ) : (
    <ActionButton variant="primary" onClick={() => setIsEditing(true)}>
      Edit Profil
    </ActionButton>
  );

  return (
    <>
      <PageHeader title="Profil Pengguna" subtitle="Kelola informasi profil Anda" actions={headerActions} mounted={mounted} />

      {/* Content */}
      <div className={`app-content smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-[#1B3A6D] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{profile.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 capitalize">{profile.role}</p>
              <p className="text-sm text-gray-500">Bergabung sejak {new Date(profile.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form className="space-y-4">
            <FormInput label="Nama Lengkap" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap..." disabled={!isEditing} />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email..."
              disabled={true} // Email shouldn't be editable
            />

            <FormInput
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Role pengguna..."
              disabled={true} // Role shouldn't be editable
            />

            <div className="pt-4">
              <label className="block text-xs font-medium text-black mb-2">UID Pengguna</label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <code className="text-sm text-gray-600">{profile.uid}</code>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
