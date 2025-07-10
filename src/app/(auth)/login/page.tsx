"use client";

import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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
    // Handle login logic here
    console.log("Login data:", formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className={`hidden lg:flex lg:w-1/2 relative smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center smooth-transition"
          style={{
            backgroundImage: `url('/kantor_desa.jpg')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#1226459e] smooth-transition"></div>

        {/* Content */}
        <div className={`relative z-10 flex flex-col justify-start items-start p-8 text-white w-full smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          {/* Logo and Title */}
          <div className={`mb-4 mt-4 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <div className="flex items-center mb-6">
              <img
                src="/logo.png"
                alt="Desa Ngebruk Logo"
                className="w-14 h-14 object-contain smooth-transition hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  const svgElement = target.nextElementSibling as HTMLElement;
                  target.style.display = "none";
                  if (svgElement) {
                    svgElement.style.display = "block";
                  }
                }}
              />
              <div className="pl-2 smooth-transition">
                <h2 className="text-lg font-bold text-white smooth-transition">Desa Ngebruk</h2>
                <p className="text-sm text-blue-200 smooth-transition">Panel Admin</p>
              </div>
            </div>
          </div>

          {/* Main Text */}
          <div className={`max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            <h1 className="text-2xl font-semibold mb-4 leading-tight text-white smooth-transition">Mulai kelola dan kembangkan website Desa Ngebruk dengan mudah melalui panel admin</h1>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className={`w-full max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          {/* Header */}
          <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 smooth-transition">Masuk</h2>
            <p className="text-gray-500 text-sm smooth-transition">Masuk ke akun Anda untuk mengakses panel admin</p>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-4 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            {/* Email Field */}
            <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 smooth-transition">
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm smooth-transition hover:border-gray-400 hover-lift"
                placeholder="Masukkan email..."
                required
              />
            </div>

            {/* Password Field */}
            <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 smooth-transition">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm smooth-transition hover:border-gray-400 hover-lift"
                  placeholder="Masukkan kata sandi..."
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 smooth-transition hover:scale-110 active:scale-95">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

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
            <button
              type="submit"
              className={`w-full bg-[#1B3A6D] text-white py-2.5 px-4 rounded-md font-medium hover:bg-[#152f5a] focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:ring-offset-2 transition-colors text-sm smooth-transition hover-lift btn-animate ${
                mounted ? "smooth-reveal stagger-4" : "animate-on-load"
              }`}
            >
              Masuk
            </button>
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
          <button
            type="button"
            className={`w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium smooth-transition hover-lift btn-animate ${
              mounted ? "smooth-reveal stagger-4" : "animate-on-load"
            }`}
          >
            <FcGoogle className="mr-3 smooth-transition" size={18} />
            <span className="smooth-transition">Masuk dengan Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
