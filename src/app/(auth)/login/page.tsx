"use client";

import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
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
    password: "",
    rememberMe: false,
  });

  const { login, loginWithGoogle, loading, error, clearError } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Clear error when component unmounts or form data changes
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

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password, formData.rememberMe);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout imageSrc="/kantor_desa.jpg" title="Mulai kelola dan kembangkan website Desa Ngebruk dengan mudah melalui panel admin" subtitle="Panel Admin" mounted={mounted}>
        {/* Header */}
        <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Masuk</h2>
          <p className="text-gray-500 text-sm smooth-transition">Masuk ke akun Anda untuk mengakses panel admin</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
          {/* Email Field */}
          <AuthInput label="Alamat Email" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email..." required mounted={mounted} />

          {/* Password Field */}
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

          {/* Remember Me and Forgot Password */}
          <div className={`flex items-center justify-between py-2 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded smooth-transition" />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 smooth-transition">
                Ingat saya
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline smooth-transition hover:text-blue-800">
              Lupa kata sandi?
            </Link>
          </div>

          {/* Login Button */}
          <AuthButton type="submit" variant="primary" mounted={mounted} disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </AuthButton>
        </form>

        {/* Don't have account */}
        <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <p className="text-sm text-gray-600 smooth-transition">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
              Daftar
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className={`mt-6 mb-6 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500 smooth-transition">atau</span>
            </div>
          </div>
        </div>

        {/* Google Sign In */}
        <AuthButton type="button" variant="google" mounted={mounted} onClick={handleGoogleSignIn} disabled={loading}>
          <FcGoogle className="mr-3 smooth-transition" size={18} />
          <span className="smooth-transition">{loading ? "Memproses..." : "Masuk dengan Google"}</span>
        </AuthButton>
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default Page;
