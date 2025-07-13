"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, resetPassword, AuthError } from "@/lib/auth";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(email, password);

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat masuk";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmail(email, password, name);

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      // Redirect to dashboard on successful registration
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat mendaftar";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();

      if ("error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat masuk dengan Google";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signOutUser();

      if (result && "error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      // Redirect to login page on successful logout
      router.push("/login");
      return { success: true };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat keluar";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await resetPassword(email);

      if (result && "error" in result) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }

      return { success: true, message: "Email reset password telah dikirim" };
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat mengirim email reset";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword,
    loading,
    error,
    clearError,
  };
};
