import { FC } from "react";
import Link from "next/link";

interface RegisterFooterProps {
  mounted: boolean;
}

const RegisterFooter: FC<RegisterFooterProps> = ({ mounted }) => {
  return (
    <div className={`mt-6 text-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <p className="text-sm text-gray-600 smooth-transition">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 hover:underline font-medium smooth-transition hover:text-blue-800">
          Masuk
        </Link>
      </p>
    </div>
  );
};

export default RegisterFooter;
