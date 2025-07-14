"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/component/auth/AuthLayout";
import AuthInput from "@/component/auth/AuthInput";
import AuthButton from "@/component/auth/AuthButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthActions } from "@/hooks/useAuth";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    agreeToTerms: false,
  });

  const { register, loading, error, clearError } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      return;
    }
    await register(formData.email, formData.password, formData.name);
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout imageSrc="/stasiun_ngebruk.JPG" title="Mulai kelola dan kembangkan website Desa Ngebruk dengan mudah melalui panel admin" subtitle="Panel Admin" mounted={mounted}>

        <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Daftar</h2>
          <p className="text-gray-500 text-sm smooth-transition">Daftarkan akun untuk mengakses website</p>
        </div>


        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>

          <AuthInput label="Alamat Email" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email..." required mounted={mounted} />


          <AuthInput label="Nama" type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama..." required mounted={mounted} />


          <AuthInput
            label="Kata Sandi"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Masukkan kata sandi..."
            required
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            mounted={mounted}
          />


          <div className={`flex items-start space-x-3 py-2 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded smooth-transition"
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed smooth-transition">
              Dengan membuat akun, saya setujui dengan{" "}
              <Link href="/terms" className="text-blue-600 hover:underline smooth-transition hover:text-blue-800">
                Ketentuan Penggunaan
              </Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline smooth-transition hover:text-blue-800">
                Kebijakan Privasi
              </Link>
            </label>
          </div>


          <AuthButton type="submit" variant="primary" disabled={!formData.agreeToTerms || loading} mounted={mounted}>
            {loading ? "Mendaftar..." : "Daftar"}
          </AuthButton>
        </form>


        <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <p className="text-sm text-gray-600 smooth-transition">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
              Masuk
            </Link>
          </p>
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default Page;

