import { FC } from "react";
import Link from "next/link";

interface LoginFooterProps {
  mounted: boolean;
}

const LoginFooter: FC<LoginFooterProps> = ({ mounted }) => {
  return (
    <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <p className="text-sm text-gray-600 smooth-transition">
        Belum punya akun?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
          Daftar
        </Link>
      </p>
    </div>
  );
};

export default LoginFooter;
