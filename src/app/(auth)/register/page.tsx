"use client";

import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import AuthLayout from "@/component/auth/AuthLayout";
import AuthInput from "@/component/auth/AuthInput";
import AuthButton from "@/component/auth/AuthButton";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", formData);
  };

  return (
    <AuthLayout imageSrc="/stasiun_ngebruk.JPG" title="Mulai kelola dan kembangkan website Desa Ngebruk dengan mudah melalui panel admin" subtitle="Panel Admin" mounted={mounted}>
      {/* Header */}
      <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Daftar</h2>
        <p className="text-gray-500 text-sm smooth-transition">Daftarkan akun untuk mengakses website</p>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
        {/* Email Field */}
        <AuthInput label="Alamat Email" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email..." required mounted={mounted} />

        {/* Name Field */}
        <AuthInput label="Nama" type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama..." required mounted={mounted} />

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

        {/* Terms Agreement */}
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

        {/* Register Button */}
        <AuthButton type="submit" variant="primary" disabled={!formData.agreeToTerms} mounted={mounted}>
          Daftar
        </AuthButton>
      </form>

      {/* Already have account */}
      <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <p className="text-sm text-gray-600 smooth-transition">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
            Masuk
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

      {/* Google Sign Up */}
      <AuthButton type="button" variant="google" mounted={mounted}>
        <FcGoogle className="mr-3 smooth-transition" size={18} />
        <span className="smooth-transition">Daftar dengan Google</span>
      </AuthButton>
    </AuthLayout>
  );
};

export default Page;
