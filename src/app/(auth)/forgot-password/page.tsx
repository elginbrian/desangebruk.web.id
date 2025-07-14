"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/component/auth/AuthLayout";
import AuthInput from "@/component/auth/AuthInput";
import AuthButton from "@/component/auth/AuthButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthActions } from "@/hooks/useAuth";

const ForgotPasswordPage = () => {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { forgotPassword, loading, error, clearError } = useAuthActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        clearError();
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (error || message) {
      clearError();
      setMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setMessage(result.message || "Email reset password telah dikirim!");
      setEmail("");
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout imageSrc="/kantor_desa.jpg" title="Pulihkan akses ke panel admin Desa Ngebruk dengan mudah" subtitle="Reset Password" mounted={mounted}>

        <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Lupa Kata Sandi</h2>
          <p className="text-gray-500 text-sm smooth-transition">Masukkan email Anda untuk menerima tautan reset kata sandi</p>
        </div>


        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md smooth-transition">
            <p className="text-green-600 text-sm font-medium mb-2">✅ Email Berhasil Dikirim!</p>
            <p className="text-green-600 text-sm">{message}</p>
            <div className="mt-3 text-xs text-green-600">
              <p>📧 Periksa folder:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                <li>Kotak Masuk (Inbox)</li>
                <li>Folder Spam/Junk</li>
                <li>Folder Promosi (Gmail)</li>
              </ul>
              <p className="mt-2">⏰ Email akan tiba dalam 1-5 menit</p>
            </div>
          </div>
        )}


        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>

          <AuthInput label="Alamat Email" type="email" id="email" name="email" value={email} onChange={handleInputChange} placeholder="Masukkan email..." required mounted={mounted} />


          <AuthButton type="submit" variant="primary" mounted={mounted} disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </AuthButton>
        </form>


        <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
          <p className="text-sm text-gray-600 smooth-transition">
            Ingat kata sandi Anda?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
              Kembali ke Masuk
            </Link>
          </p>
        </div>
      </AuthLayout>
    </ProtectedRoute>
  );
};

export default ForgotPasswordPage;

